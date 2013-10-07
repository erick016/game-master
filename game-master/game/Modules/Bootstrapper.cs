// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Bootstrapper.cs" company="Jim Counts">
//   Copyright Jim Counts 2013
// </copyright>
// <summary>
//   Configures Nancy.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Game.Modules
{
    using Nancy;

    /// <summary>
    /// Configures Nancy.
    /// </summary>
    // ReSharper disable UnusedMember.Global
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        /// <summary>
        /// Lets Nancy know about the static files.
        /// </summary>
        /// <param name="nancyConventions">The nancy conventions.</param>
        protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);

            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/lib"));
            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/img"));
            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/css"));

            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/src"));
            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/spec"));
        }
    }

    // ReSharper restore UnusedMember.Global
}