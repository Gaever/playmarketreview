import getQueryClient from "@/lib/get-query-client";
import { Hydrate as RCHydrate, dehydrate } from "@tanstack/react-query";

export interface HydrateProps extends React.PropsWithChildren {}

function Hydrate(props: HydrateProps) {
  const dehydratedState = dehydrate(getQueryClient());

  return <RCHydrate state={dehydratedState}>{props.children}</RCHydrate>;
}

export default Hydrate;
