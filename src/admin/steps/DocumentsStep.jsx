// steps/DocumentsStep.jsx
import { DOC_FIELDS } from "../pages/AdminRegister";
import { FileUpload } from "../components/FormComponents";

export default function DocumentsStep({ passportPhoto, setPassportPhoto, documents, setDocuments }) {
  const handleDocChange = (e) => {
    setDocuments(prev => ({ ...prev, [e.target.name]: e.target.files }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <FileUpload
          label="Passport Photo"
          file={passportPhoto}
          setFile={setPassportPhoto}
          accept="image/*"
        />

        {DOC_FIELDS.map(([name, label, multiple]) => (
          <FileUpload
            key={name}
            label={label}
            file={documents[name]?.[0] || null}
            setFile={(file) => {
              if (file) {
                setDocuments(prev => ({ ...prev, [name]: [file] }));
              } else {
                setDocuments(prev => ({ ...prev, [name]: undefined }));
              }
            }}
            multiple={multiple}
            accept=".pdf,.doc,.docx"
          />
        ))}
      </div>

      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
        📌 PDFs are stored in the database · Images are uploaded to Cloudinary
      </p>
    </div>
  );
}