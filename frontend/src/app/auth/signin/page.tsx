import SignIn from "@/components/sign-in/signin";

export interface PageProps {
  searchParams: {
    callbackUrl: string | undefined;
  };
}

async function Page(props: PageProps) {
  return <SignIn redirectTo={props.searchParams.callbackUrl} />;
}

export default Page;
