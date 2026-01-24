import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="p-4">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-green-600 hover:bg-green-700 text-sm normal-case",
            },
          }}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
