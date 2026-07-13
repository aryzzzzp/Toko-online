import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display italic text-3xl text-forest mb-2">Tambah Kategori</h1>
        <p className="text-charcoal/60">Buat kategori baru untuk katalog.</p>
      </div>

      <CategoryForm />
    </div>
  );
}
