import { FaGoogle } from "react-icons/fa";
import { signIn, providerMap } from "@/auth";
import SigninButton from "@/components/SigninButton";

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) => {
  const { callbackUrl } = await searchParams;

  return (
    <section className="bg-blue-50 min-h-screen grow">
      <div className="container m-auto max-w-sm py-24">
        <div className="bg-white px-6 py-12 mb-4 shadow-md rounded-md border m-4 md:m-0">
          {Object.values(providerMap).map((provider) => (
            <div key={provider.id}>
              {provider.id === "google" ? (
                <form
                  action={async () => {
                    "use server";
                    try {
                      await signIn(provider.id, {
                        redirectTo: callbackUrl ?? "",
                      });
                    } catch (error) {
                      throw error;
                    }
                  }}
                >
                  <SigninButton
                    text="Sign in with Google"
                    pendingText="Signin in..."
                    Icon={<FaGoogle className="text-white mr-2" />}
                  />
                  <hr />
                </form>
              ) : null}
              {provider.id === "mailgun" ? (
                <form
                  action={async (formData) => {
                    "use server";
                    try {
                      let email = "";
                      if (formData.has("email")) {
                        email = formData.get("email") as string;
                      }
                      await signIn(provider.id, {
                        email,
                        redirectTo: callbackUrl ?? "",
                      });
                    } catch (error) {
                      throw error;
                    }
                  }}
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Enter your email to receive a login link
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="email"
                      id="email"
                      type="email"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <SigninButton
                    text="Send login link"
                    pendingText="Sending link..."
                  />
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
