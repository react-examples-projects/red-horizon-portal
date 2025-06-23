import { Suspense } from "react";

function LazyComponent({ component: Component, loader = <h1>Cargando</h1> }) {
  return (
    <Suspense fallback={loader}>
      <Component />
    </Suspense>
  );
}

function Async(component) {
  const lazyComponent = () => <LazyComponent component={component} />;
  return lazyComponent;
}

export default Async;
export { LazyComponent };
