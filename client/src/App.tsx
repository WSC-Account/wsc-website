import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DeferredAppServices from "./components/DeferredAppServices";
import MarketingAttribution from "./components/MarketingAttribution";

const AdultTennis = lazy(() => import("./pages/AdultTennis"));
const Tennis = lazy(() => import("./pages/Tennis"));
const SummerTennis = lazy(() => import("./pages/SummerTennis"));
const Golf = lazy(() => import("./pages/Golf"));
const DrivingRange = lazy(() => import("./pages/DrivingRange"));
const GolfTournaments = lazy(() => import("./pages/GolfTournaments"));
const Gym = lazy(() => import("./pages/Gym"));
const Fitness = lazy(() => import("./pages/Fitness"));
const FreeFitnessAssessment = lazy(() => import("./pages/FreeFitnessAssessment"));
const Pickleball = lazy(() => import("./pages/Pickleball"));
const Summer = lazy(() => import("./pages/Summer"));
const Membership = lazy(() => import("./pages/Membership"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Events = lazy(() => import("./pages/Events"));
const Careers = lazy(() => import("./pages/Careers"));
const MemberCancellationFormPage = lazy(() => import("./pages/MemberCancellationFormPage"));
const PersonalTraining = lazy(() => import("./pages/PersonalTraining"));
const PersonalTrainingFormPage = lazy(() => import("./pages/PersonalTrainingFormPage"));
const GolfLessonFormPage = lazy(() => import("./pages/GolfLessonFormPage"));
const NewsletterSignupPage = lazy(() => import("./pages/NewsletterSignupPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Policies = lazy(() => import("./pages/Policies"));
const PolicyDetail = lazy(() => import("./pages/PolicyDetail"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ProShop = lazy(() => import("./pages/ProShop"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoading() {
  return (
    <div
      className="min-h-screen bg-parchment text-ink flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <p className="text-[12px] tracking-[0.18em] uppercase text-ink-light">
        Loading
      </p>
    </div>
  );
}

function ScrollToTopOnRouteChange() {
  useEffect(() => {
    let observer: MutationObserver | undefined;
    let timeoutId: number | undefined;
    let frameId = 0;
    let previousPath = window.location.pathname;
    let pendingTopReset = true;
    const cleanup = () => {
      observer?.disconnect();
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
    const scroll = () => {
      // A single navigation can emit multiple history/hash events before the
      // frame runs. Keep its required reset when replacing a scheduled frame.
      pendingTopReset ||= previousPath !== window.location.pathname;
      previousPath = window.location.pathname;
      cleanup();
      frameId = window.requestAnimationFrame(() => {
        const resetTop = pendingTopReset;
        pendingTopReset = false;
        let hash = window.location.hash.slice(1);
        try { hash = decodeURIComponent(hash); } catch { /* Use the literal malformed hash. */ }
        if (!hash) {
          if (resetTop) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
          return;
        }
        const scrollToTarget = () => {
          const target = document.getElementById(hash);
          if (!target) return false;
          const headerHeight = document.querySelector("nav > div")?.getBoundingClientRect().height ?? 0;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: "auto" });
          observer?.disconnect();
          window.clearTimeout(timeoutId);
          return true;
        };
        if (scrollToTarget()) return;
        observer = new MutationObserver(scrollToTarget);
        observer.observe(document.getElementById("main-content") ?? document.body, { childList: true, subtree: true });
        timeoutId = window.setTimeout(() => observer?.disconnect(), 10_000);
      });
    };
    // Wouter emits the History API events, including same-path hash changes.
    const events = ["popstate", "hashchange", "pushState", "replaceState"];
    events.forEach(event => window.addEventListener(event, scroll));
    scroll();
    return () => {
      cleanup();
      events.forEach(event => window.removeEventListener(event, scroll));
    };
  }, []);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tennis" component={Tennis} />
        <Route path="/tennis/adult" component={AdultTennis} />
        <Route path="/tennis/summer-tennis" component={SummerTennis} />
        <Route path="/golf/driving-range" component={DrivingRange} />
        <Route path="/golf/tournaments" component={GolfTournaments} />
        <Route path="/golf" component={Golf} />
        <Route path="/gym" component={Gym} />
        <Route path="/fitness" component={Fitness} />
        <Route path="/free-fitness-assessment" component={FreeFitnessAssessment} />
        <Route path="/pickleball" component={Pickleball} />
        <Route path="/summer" component={Summer} />
        <Route path="/membership" component={Membership} />
        <Route path="/passes" component={Membership} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/events" component={Events} />
        <Route path="/events-1" component={Events} />
        <Route path="/food-trucks">{() => <Redirect to="/events" />}</Route>
        <Route path="/careers" component={Careers} />
        <Route path="/member-request" component={MemberCancellationFormPage} />
        <Route path="/member-cancellation" component={MemberCancellationFormPage} />
        <Route path="/member-cancelation" component={MemberCancellationFormPage} />
        <Route path="/personal-training" component={PersonalTraining} />
        <Route path="/personal-training-interest-form" component={PersonalTrainingFormPage} />
        <Route path="/personal-training-request" component={PersonalTrainingFormPage} />
        <Route path="/golf-coaching" component={GolfLessonFormPage} />
        <Route path="/golf-lessons" component={GolfLessonFormPage} />
        <Route path="/newsletter-signup" component={NewsletterSignupPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/categories/:category" component={BlogCategory} />
        <Route path="/post/:slug" component={BlogPost} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/privacy">{() => <Redirect to="/policies#privacy" />}</Route>
        <Route path="/policies" component={Policies} />
        <Route path="/policies/:slug" component={PolicyDetail} />
        <Route path="/faq" component={FAQ} />
        <Route path="/pro-shop" component={ProShop} />
        <Route path="/terms">{() => <Redirect to="/policies#terms" />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <MarketingAttribution />
      <ScrollToTopOnRouteChange />
      <header>
        <Navbar />
      </header>
      <main id="main-content" tabIndex={-1}>
        <Router />
      </main>
      <Footer />
      <DeferredAppServices />
    </ErrorBoundary>
  );
}

export default App;
