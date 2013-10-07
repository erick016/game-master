// --------------------------------------------------------------------------------------------------------------------
// <copyright file="GameEvent.cs" company="Jim Counts">
//      Copyright Jim Counts 2013
// </copyright>
// <summary>
//   A game event.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
namespace Game.Modules
{
    using System;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// A game event.
    /// </summary>
    // ReSharper disable ClassNeverInstantiated.Global
    public class GameEvent : TableEntity

    // ReSharper restore ClassNeverInstantiated.Global
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GameEvent"/> class.
        /// </summary>
        public GameEvent()
        {
            this.RowKey = Guid.NewGuid().ToString();
        }

        // ReSharper disable UnusedMember.Global

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// Gets or sets the create date.
        /// </summary>
        public DateTime CreateDate { get; set; }

        /// <summary>
        /// Gets or sets the label.
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        public string Value { get; set; }

        // ReSharper restore UnusedMember.Global
    }
}