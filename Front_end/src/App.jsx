import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterAdmin from "./pages/RegisterAdmin";

export default function App() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Pharmacy App</h1>
      <div className="grid grid-cols-2 gap-6">
        <RegisterCustomer />
        <RegisterAdmin />
      </div>
    </div>
  );
}