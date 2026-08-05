import { SellerRegistrationWizard } from "@/components/seller/registration/wizard";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-2xl mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Become a{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-orange-500 bg-clip-text text-transparent">
            Zyventa Seller
          </span>
        </h1>
        <p className="mt-3 text-slate-500 text-base">
          Join thousands of sellers on the UAE's fastest-growing healthcare marketplace.
          Complete the form below to apply.
        </p>
      </div>
      <SellerRegistrationWizard />
    </div>
  );
}
