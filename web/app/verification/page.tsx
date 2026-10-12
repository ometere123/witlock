import { RouteShell } from '@/app/_components/RouteShell';
import NetworkHealth from '@/app/_components/NetworkHealth';

export default function VerificationPage() {
  return <RouteShell eyebrow="Network health" title="Verify the deployment before you trust the state." intro="The health surface presents configuration and evidence separately. A configured endpoint is not a verified contract deployment.">
    <NetworkHealth />
  </RouteShell>;
}
