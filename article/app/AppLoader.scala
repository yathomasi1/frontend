import http.{CommonFilters, CorsHttpErrorHandler}
import app.{FrontendApplicationLoader, FrontendComponents}
import assets.DiscussionExternalAssetsLifecycle
import com.softwaremill.macwire._
import common._
import common.Logback.{LogbackOperationsPool, LogstashLifecycle}
import _root_.commercial.targeting.TargetingLifecycle
import akka.actor.ActorSystem
import common.commercial.OrielCacheLifecycle
import common.dfp.DfpAgentLifecycle
import conf.switches.SwitchboardLifecycle
import conf.CachedHealthCheckLifeCycle
import contentapi.{CapiHttpClient, ContentApiClient, HttpClient}
import controllers.{ArticleControllers, HealthCheck}
import dev.{DevAssetsController, DevParametersHttpRequestHandler}
import model.ApplicationIdentity
import services.ophan.SurgingContentAgentLifecycle
import play.api.ApplicationLoader.Context
import play.api.BuiltInComponentsFromContext
import play.api.http.{HttpErrorHandler, HttpRequestHandler}
import play.api.mvc.EssentialFilter
import play.api.routing.Router
import services.{NewspaperBooksAndSectionsAutoRefresh, OphanApi}
import router.Routes

class AppLoader extends FrontendApplicationLoader {
  override def buildComponents(context: Context): FrontendComponents = new BuiltInComponentsFromContext(context) with AppComponents
}

trait AppComponents extends FrontendComponents with ArticleControllers {

  lazy val capiHttpClient: HttpClient = wire[CapiHttpClient]
  lazy val contentApiClient = wire[ContentApiClient]
  lazy val ophanApi = wire[OphanApi]

  lazy val healthCheck = wire[HealthCheck]
  lazy val devAssetsController = wire[DevAssetsController]
  lazy val logbackOperationsPool = wire[LogbackOperationsPool]

  override lazy val lifecycleComponents = List(
    wire[LogstashLifecycle],
    wire[NewspaperBooksAndSectionsAutoRefresh],
    wire[DfpAgentLifecycle],
    wire[CloudWatchMetricsLifecycle],
    wire[SurgingContentAgentLifecycle],
    wire[SwitchboardLifecycle],
    wire[CachedHealthCheckLifeCycle],
    wire[TargetingLifecycle],
    wire[DiscussionExternalAssetsLifecycle],
    wire[OrielCacheLifecycle]
  )

  lazy val router: Router = wire[Routes]

  lazy val appIdentity = ApplicationIdentity("article")

  override lazy val appMetrics = ApplicationMetrics(
    ContentApiMetrics.HttpLatencyTimingMetric,
    ContentApiMetrics.HttpTimeoutCountMetric,
    ContentApiMetrics.ContentApiErrorMetric,
    ContentApiMetrics.ContentApiRequestsMetric
  )

  override lazy val httpErrorHandler: HttpErrorHandler = wire[CorsHttpErrorHandler]
  override lazy val httpFilters: Seq[EssentialFilter] = wire[CommonFilters].filters
  override lazy val httpRequestHandler: HttpRequestHandler = wire[DevParametersHttpRequestHandler]

  def actorSystem: ActorSystem
}
