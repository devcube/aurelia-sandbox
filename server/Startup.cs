using Microsoft.AspNet.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace aureliasandbox
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddLogging();
            // Add Cors support to the service
            // TODO: I'm not sure that this is needed but I will keep it until the api proxy works
            services.AddCors(options =>
            {
                options.AddPolicy("mypolicy",
                    builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            });
        }

        public void Configure(IApplicationBuilder app, ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger<Startup>();
            loggerFactory.AddConsole();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "default", template: "api/{controller=Home}/{action=Index}/{id?}");
            });

            app.UseCors("mypolicy");
        }
    }
}
