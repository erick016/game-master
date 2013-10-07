// --------------------------------------------------------------------------------------------------------------------
// <copyright file="TableReferencePool.cs" company="Jim Counts">
//   Copyright Jim Counts 2013
// </copyright>
// <summary>
//   The table reference pool.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Game.Modules
{
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using System;
    using System.Collections.Generic;
    using System.Configuration;

    /// <summary>
    /// The table reference pool.
    /// </summary>
    public class TableReferencePool
    {
        /// <summary>
        /// The pool instance
        /// </summary>
        private static readonly TableReferencePool Instance = new TableReferencePool();

        /// <summary>
        /// The pool storage.
        /// </summary>
        private readonly Dictionary<string, Stack<CloudTable>> pool = new Dictionary<string, Stack<CloudTable>>(StringComparer.OrdinalIgnoreCase);

        /// <summary>
        /// The pool lock
        /// </summary>
        private readonly object poolLock = new object();

        /// <summary>
        /// Prevents a default instance of the <see cref="TableReferencePool"/> class from being created.
        /// </summary>
        private TableReferencePool()
        {
        }

        /// <summary>
        /// Gets the pool instance
        /// </summary>
        public static TableReferencePool Pool
        {
            get { return Instance; }
        }

        /// <summary>
        /// Acquires a <see cref="CloudTableReference"/> instance.
        /// </summary>
        /// <returns>
        /// A <see cref="CloudTableReference"/>.
        /// </returns>
        /// <param name="type">The type to store in the table.</param>
        public CloudTableReference Acquire(Type type)
        {
            string tableName = (type + "").Replace(".", string.Empty);
            return Acquire(tableName);
        }

        /// <summary>
        /// Acquires a <see cref="CloudTableReference" /> instance.
        /// </summary>
        /// <param name="tableName">Name of the table.</param>
        /// <returns>
        /// A <see cref="CloudTableReference" />.
        /// </returns>
        public CloudTableReference Acquire(string tableName)
        {
            return this.Acquire(this.pool, tableName) ?? new CloudTableReference(tableName);
        }

        /// <summary>
        /// Acquire a <see cref="CloudTableReference" /> using the pool of specified instances.
        /// </summary>
        /// <param name="instances">The instances.</param>
        /// <param name="tableName">Name of the table.</param>
        /// <returns>
        /// A <see cref="CloudTableReference" /> if any <see cref="CloudTable" />s are available, otherwise null.
        /// </returns>
        private CloudTableReference Acquire(Dictionary<string, Stack<CloudTable>> instances, string tableName)
        {
            lock (this.poolLock)
            {
                if (!instances.ContainsKey(tableName))
                {
                    instances[tableName] = new Stack<CloudTable>();
                }

                if (0 < instances[tableName].Count)
                {
                    return new CloudTableReference(instances[tableName].Pop(), tableName);
                }
            }

            return null;
        }

        /// <summary>
        /// Releases the specified instance to the pool.
        /// </summary>
        /// <param name="instance">The instance.</param>
        /// <param name="tableName">Name of the table.</param>
        private void Release(CloudTableReference instance, string tableName)
        {
            lock (this.poolLock)
            {
                this.pool[tableName].Push(instance.CloudTable);
            }
        }

        /// <summary>
        /// A reference to a <see cref="CloudTable"/> which will be returned to the pool when disposed.
        /// </summary>
        public class CloudTableReference : IDisposable
        {
            /// <summary>
            /// The connection string
            /// </summary>
            private static readonly ConnectionStringSettings ConnectionInfo = ConfigurationManager.ConnectionStrings["StorageConnectionString"];

            /// <summary>
            /// The table name
            /// </summary>
            private readonly string tableName;

            /// <summary>
            /// The cloud table.
            /// </summary>
            private CloudTable cloudTable;

            /// <summary>
            /// The disposed.
            /// </summary>
            private bool disposed;

            /// <summary>
            /// Initializes a new instance of the <see cref="CloudTableReference" /> class.
            /// </summary>
            /// <param name="tableName">Name of the table.</param>
            public CloudTableReference(string tableName)
            {
                this.tableName = tableName;
                var table = CloudStorageAccount.Parse(ConnectionInfo.ConnectionString)
                                               .CreateCloudTableClient()
                                               .GetTableReference(tableName);
                table.CreateIfNotExists();
                this.cloudTable = table;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="CloudTableReference" /> class.
            /// </summary>
            /// <param name="cloudTable">The cloud table.</param>
            /// <param name="tableName">Name of the table.</param>
            public CloudTableReference(CloudTable cloudTable, string tableName)
            {
                this.cloudTable = cloudTable;
                this.tableName = tableName;
            }

            /// <summary>
            /// Gets the cloud table.
            /// </summary>
            /// <value>
            /// The cloud table.
            /// </value>
            /// <exception cref="System.ObjectDisposedException">CloudTableReference was already disposed.</exception>
            public CloudTable CloudTable
            {
                get
                {
                    if (this.disposed)
                    {
                        throw new ObjectDisposedException("CloudTableReference");
                    }

                    return this.cloudTable;
                }
            }

            /// <summary>
            /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
            /// </summary>
            public void Dispose()
            {
                this.Dispose(true);
                GC.SuppressFinalize(this);
            }

            /// <summary>
            /// Releases unmanaged and - optionally - managed resources.
            /// </summary>
            /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
            private void Dispose(bool disposing)
            {
                if (this.disposed)
                {
                    return;
                }

                if (disposing)
                {
                    if (this.cloudTable != null)
                    {
                        Pool.Release(this, this.tableName);
                        this.cloudTable = null;
                    }
                }

                this.disposed = true;
            }
        }
    }
}