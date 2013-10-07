// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultModule.cs" company="Jim Counts">
//   Copyright Jim Counts 2013
// </copyright>
// <summary>
//   Hosts the server side code.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Game.Modules
{
    using Microsoft.WindowsAzure.Storage.Table;
    using Nancy;
    using Nancy.ModelBinding;
    using Nancy.Responses.Negotiation;
    using System.Threading.Tasks;

    // ReSharper disable UnusedMember.Global

    /// <summary>
    /// Hosts the server side code.
    /// </summary>
    public class DefaultModule : NancyModule
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DefaultModule"/> class.
        /// </summary>
        public DefaultModule()
        {
            this.Get["/Load"] = _ => this.Load();
            this.Get["/SpecRunner"] = _ => this.View["SpecRunner"];
            this.Get[@"/(.*)"] = _ => this.View["index"];
            this.Get[@"/"] = _ => this.View["index"];

            this.Post["/Collect"] = arg =>
                {
                    Task.Factory.StartNew(() => this.Save());
                    return HttpStatusCode.OK;
                };
            this.Post["/Store"] = arg =>
                {
                    Task.Factory.StartNew(() => this.SaveSettings());
                    return HttpStatusCode.OK;
                };
        }

        /// <summary>
        /// Loads settings.
        /// </summary>
        /// <returns>The requested settings.</returns>
        private Negotiator Load()
        {
            var rowKey = this.Request.Query["rowKey"];
            var retrieve = TableOperation.Retrieve<GameSettings>(GameSettings.Version, rowKey);
            using (var table = TableReferencePool.Pool.Acquire(typeof(GameSettings)))
            {
                TableResult queryResult = table.CloudTable.Execute(retrieve);
                if (queryResult.Result != null)
                {
                    Task.Factory.StartNew(() =>
                    {
                        var gameSettings = (GameSettings)queryResult.Result;
                        gameSettings.LoadCount++;
                        var replace = TableOperation.Replace(gameSettings);
                        using (var saver = TableReferencePool.Pool.Acquire(typeof(GameSettings)))
                        {
                            saver.CloudTable.Execute(replace);
                        }
                    });
                }
                return Negotiate.WithModel(queryResult.Result)
                    .WithStatusCode(queryResult.HttpStatusCode);
            }
        }

        /// <summary>
        /// Saves the event.
        /// </summary>
        /// <returns>
        /// Status 200 if the task completes without error.
        /// </returns>
        private Response Save()
        {
            var dataPoint = this.Bind<GameEvent>();
            var operation = TableOperation.Insert(dataPoint);
            using (var r = TableReferencePool.Pool.Acquire(typeof(GameEvent)))
            {
                var tableResult = r.CloudTable.Execute(operation);
                return tableResult.HttpStatusCode;
            }
        }

        /// <summary>
        /// Saves the settings.
        /// </summary>
        /// <returns>Always OK</returns>
        private Response SaveSettings()
        {
            var settings = this.Bind<GameSettings>();
            var getExisting = TableOperation.Retrieve<GameSettings>(settings.PartitionKey, settings.RowKey);
            var insertNew = TableOperation.Insert(settings);
            using (var r = TableReferencePool.Pool.Acquire(typeof(GameSettings)))
            {
                var result = r.CloudTable.Execute(getExisting);
                var existing = (GameSettings)result.Result;
                TableResult tableResult;
                if (existing == null)
                {
                    tableResult = r.CloudTable.Execute(insertNew);
                }
                else
                {
                    existing.StoreCount++;
                    var replace = TableOperation.Replace(existing);
                    tableResult = r.CloudTable.Execute(replace);
                }

                return tableResult.HttpStatusCode;
            }
        }

        // ReSharper restore UnusedMember.Global
    }
}