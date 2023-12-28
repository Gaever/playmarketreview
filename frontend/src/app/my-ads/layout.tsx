import AuthorizedLayout from "@/components/authorized-layout/authorized-layout";

export default function Layout(props: React.PropsWithChildren) {
  return <AuthorizedLayout>{props.children}</AuthorizedLayout>;
}
