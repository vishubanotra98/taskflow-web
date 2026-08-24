import { Suspense } from "react";
import { Integration } from "../../components/IntegrationCoponent";

function IntegrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Integration />
    </Suspense>
  );
}

export default IntegrationPage;
