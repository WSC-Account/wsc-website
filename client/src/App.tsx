import { lazy, Suspense, useEffect } from "react";
import { Redirect, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DeferredAppServices from "./components/DeferredAppServices";

const Tennis = lazy(() => import("./pages/Tennis"));
const Golf = lazy(() => import("./pages/Golf"));
const Gym = lazy(() => import("./pages/Gym"));
const Fitness = lazy(() => import("./pages/Fitness"));
const Pickleball = lazy(() => import("./pages/Pickleball"));
const Summer = lazy(() => import("./pages/Summer"));
const Membership = lazy(() => import("./pages/Membership"));
const Sessions = lazy(() => import("./pages/Sessions"));
const Events = lazy(() => import("./pages/Events"));
const FoodTrucks = lazy(() => import("./pages/FoodTrucks"));
const Careers = lazy(() => import("./pages/Careers"));
const MemberCancellationFormPage = lazy(() => import("./pages/MemberCancellationFormPage"));
const PersonalTrainingFormPage = lazy(() => import("./pages/PersonalTrainingFormPage"));
const GolfLessonFormPage = lazy(() => import("./pages/GolfLessonFormPage"));
const NewsletterSignupPage = lazy(() => import("./pages/NewsletterSignupPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogCategory = lazy(() => import("./pages/BlogCategory"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Policies = lazy(() => import("./pages/Policies"));
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
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tennis" component={Tennis} />
        <Route path="/golf" component={Golf} />
        <Route path="/gym" component={Gym} />
        <Route path="/fitness" component={Fitness} />
        <Route path="/pickleball" component={Pickleball} />
        <Route path="/summer" component={Summer} />
        <Route path="/membership" component={Membership} />
        <Route path="/sessions" component={Sessions} />
        <Route path="/events" component={Events} />
        <Route path="/events-1" component={Events} />
        <Route path="/food-trucks" component={FoodTrucks} />
        <Route path="/careers" component={Careers} />
        <Route path="/member-request" component={MemberCancellationFormPage} />
        <Route path="/member-cancellation" component={MemberCancellationFormPage} />
        <Route path="/member-cancelation" component={MemberCancellationFormPage} />
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
        <Route path="/privacy" component={Privacy} />
        <Route path="/policies" component={Policies} />
        <Route path="/faq" component={FAQ} />
        <Route path="/pro-shop" component={ProShop} />
        <Route path="/terms">{() => <Redirect to="/policies" />}</Route>
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ScrollToTopOnRouteChange />
        <header>
          <Navbar />
        </header>
        <main id="main-content" tabIndex={-1}>
          <Router />
        </main>
        <Footer />
        <DeferredAppServices />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
