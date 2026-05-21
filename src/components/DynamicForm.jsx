import { useState, useEffect } from "react";
import Input from "./Input";
import Select from "./Select";
import TextArea from "./TextArea";

/**
 * DynamicForm — Komponen Form Pintar & Universal
 * Props:
 *   fields: array of object — konfigurasi struktur kolom input
 *   initialData: object — data awal untuk kebutuhan EDIT (opsional)
 *   onChange: function — mengirim state form terbaru ke halaman utama
 *   customRender: function — untuk merender layout custom seperti radio button khusus (opsional)
 */
export default function DynamicForm({ fields = [], initialData = {}, onChange, customRender }) {
  const [form, setForm] = useState({});

  // Set data awal saat modal edit dibuka
  useEffect(() => {
    setForm(initialData || {});
  }, [initialData]);

  const handleInputChange = (name, value) => {
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    onChange(updatedForm); // Teruskan data ke parent page
  };

  return (
    <div className="space-y-4 text-left">
      {fields.map((field) => {
        // 1. INPUT TYPE SELECT
        if (field.type === "select") {
          return (
            <Select
              key={field.name}
              label={field.label}
              name={field.name}
              value={form[field.name] ?? field.defaultValue ?? ""}
              options={field.options}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          );
        }

        // 2. INPUT TYPE TEXTAREA
        if (field.type === "textarea") {
          return (
            <TextArea
              key={field.name}
              label={field.label}
              name={field.name}
              value={form[field.name] ?? field.defaultValue ?? ""}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          );
        }

        // 3. INPUT STANDARD (text, number, email, tel, dll)
        return (
          <Input
            key={field.name}
            type={field.type || "text"}
            label={field.label}
            name={field.name}
            value={form[field.name] ?? field.defaultValue ?? ""}
            placeholder={field.placeholder}
            min={field.min}
            step={field.step}
            required={field.required}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
          />
        );
      })}

      {/* Bagian penampung jika halaman butuh desain radio button custom (seperti Tipe Layanan atau Jenis Cucian) */}
      {customRender && customRender(form, handleInputChange)}
    </div>
  );
}