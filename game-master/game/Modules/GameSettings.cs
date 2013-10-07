// --------------------------------------------------------------------------------------------------------------------
// <copyright file="GameSettings.cs" company="Jim Counts">
//     Copyright (c) Jim Counts 2013. All rights reserved.
// </copyright>
// <summary>
//   Defines the GameSettings type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------
using System;

namespace Game.Modules
{
    using Microsoft.WindowsAzure.Storage.Table;

    // ReSharper disable UnusedMember.Global
    // ReSharper disable ClassNeverInstantiated.Global

    /// <summary>
    /// Game settings
    /// </summary>
    public class GameSettings : TableEntity
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="GameSettings"/> class.
        /// </summary>
        public GameSettings()
        {
            this.PartitionKey = Version;
            this.StoreCount = 1;
            this.LoadCount = 0;
        }

        /// <summary>
        /// Gets the partition version.
        /// </summary>
        /// <value>
        /// The version.
        /// </value>
        public static string Version
        {
            get { return "0.0.1"; }
        }

        /// <summary>
        /// Gets or sets the number of times the settings have been loaded.
        /// </summary>
        public int LoadCount { get; set; }

        /// <summary>
        /// Gets or sets the settings.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public string Settings { get; set; }

        /// <summary>
        /// Gets or sets the number of times these settings have been stored.
        /// </summary>
        /// <value>
        /// The store count.
        /// </value>
        public long StoreCount { get; set; }
    }

    // ReSharper restore UnusedMember.Global
    // ReSharper restore ClassNeverInstantiated.Global
}