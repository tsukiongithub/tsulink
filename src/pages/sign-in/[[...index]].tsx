import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      redirectUrl={"/me"}
    />
  );
};

export default SignInPage;
