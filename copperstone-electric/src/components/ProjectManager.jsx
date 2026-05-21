import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Edit2, Trash2, Plus, Eye, Save, Globe, EyeOff, Star } from "lucide-react";

const C = "#C87533";
const DARK = "#070605";

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null means list view, object means edit view
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error(error);
      alert("Failed to fetch projects");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleCreateNew = () => {
    setFormData({
      title: "",
      slug: "",
      project_type: "",
      location: "",
      summary: "",
      is_published: false,
      is_featured: false,
      image_path: ""
    });
    setImageFile(null);
    setPreviewUrl("");
    setEditing({}); // trigger edit view
  };

  const handleEdit = (project) => {
    setFormData({ ...project });
    setImageFile(null);
    if (project.image_path) {
      // Create a public URL for previewing existing image
      setPreviewUrl(supabase.storage.from("project-images").getPublicUrl(project.image_path).data.publicUrl);
    } else {
      setPreviewUrl("");
    }
    setEditing(project);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) alert("Failed to delete project");
    else fetchProjects();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // live preview without uploading
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let finalImagePath = formData.image_path;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, imageFile);
      
      if (error) {
        alert("Failed to upload image: " + error.message);
        setSaving(false);
        return;
      }
      finalImagePath = data.path;
    }

    // Auto slug if empty
    let slug = formData.slug;
    if (!slug && formData.title) {
        slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const payload = {
      ...formData,
      slug,
      image_path: finalImagePath,
      image_alt: formData.image_alt || formData.title || 'Project image',
    };
    
    // Remove id if it's a new project to let Supabase generate UUID
    if (!payload.id) delete payload.id;

    const { error } = await supabase.from("projects").upsert(payload);
    
    if (error) {
      alert("Failed to save project: " + error.message);
    } else {
      setEditing(null);
      fetchProjects();
    }
    setSaving(false);
  };

  if (editing !== null) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <h3 style={{ margin: 0 }}>{formData.id ? "Edit Project" : "New Project"}</h3>
          <button onClick={() => setEditing(null)} style={{ padding: "8px 16px", cursor: "pointer", background: "white", border: "1px solid #ccc", borderRadius: "6px", fontWeight: "bold" }}>Cancel</button>
        </div>

        <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
          {/* LEFT: FORM FIELDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#555" }}>Project Title *</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#555" }}>Slug (URL friendly)</label>
              <input type="text" value={formData.slug} placeholder="Leave blank to auto-generate" onChange={e => setFormData({...formData, slug: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#555" }}>Project Type *</label>
                <input required type="text" value={formData.project_type} placeholder="e.g. Retail Build-out" onChange={e => setFormData({...formData, project_type: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#555" }}>Location *</label>
                <input required type="text" value={formData.location} placeholder="e.g. Houston, TX" onChange={e => setFormData({...formData, location: e.target.value})} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: "#555" }}>Project Image *</label>
              <input type={formData.image_path && !imageFile ? "text" : "file"} accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", background: "white", boxSizing: "border-box" }} />
              {formData.image_path && !imageFile && (
                <div style={{ marginTop: "10px", fontSize: "13px" }}>
                  Current image path: <code>{formData.image_path}</code>
                  <br />
                  <label style={{ cursor: "pointer", color: C, textDecoration: "underline", fontWeight: "bold", display: "inline-block", marginTop: "5px" }}>
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </label>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "10px", background: "#f9f9f9", padding: "15px", borderRadius: "8px", border: "1px solid #eee" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} />
                <strong>Published</strong> (Visible to public)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} />
                <strong>Featured</strong> (Show on homepage)
              </label>
            </div>

            <div style={{ marginTop: "10px", display: "flex", gap: "15px" }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: "12px", background: C, color: "white", fontWeight: "bold", border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                <Save size={18} /> {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", border: "1px solid #eee" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 15, display: "flex", alignItems: "center", gap: 6, color: "#555" }}>
              <Eye size={16} color={C} /> Live Card Preview
            </label>
            
            <div style={{ 
              borderRadius: 10, overflow: "hidden", background: "#1a1510", 
              border: "1px solid rgba(0,0,0,0.2)", aspectRatio: "4/3", 
              display: "flex", flexDirection: "column", justifyContent: "flex-end", 
              padding: 24, position: "relative", width: "100%", maxWidth: "380px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)", margin: "0 auto"
            }}>
              {previewUrl ? (
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${previewUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden="true" />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>No Image Selected</div>
              )}
              
              <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,6,0.55)" }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C}20 0%, transparent 62%)` }} />
              
              <div style={{ position: "relative", zIndex: 10 }}>
                <p style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>
                  {formData.project_type || "Type"} - {formData.location || "Location"}
                </p>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>
                  {formData.title || "Project Title"}
                </h3>
              </div>
            </div>
            
            <div style={{ marginTop: 20, padding: "15px", background: "white", borderRadius: "6px", border: "1px solid #ddd", fontSize: 13, color: "#555", lineHeight: 1.5 }}>
              <p style={{ margin: "0 0 8px 0" }}><strong>Preview Guide:</strong></p>
              <p style={{ margin: "0 0 8px 0" }}>This is exactly how the card will look to visitors if it is marked as <strong>Featured</strong> and <strong>Published</strong>.</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li><strong>Published:</strong> Make project live in the database.</li>
                <li><strong>Featured:</strong> Pin it directly to the homepage grid.</li>
              </ul>
            </div>
          </div>

        </form>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <p style={{ margin: 0, color: "#555" }}>Create and edit projects, toggle visibility, and upload images.</p>
        <button onClick={handleCreateNew} style={{ background: DARK, color: "white", padding: "10px 16px", borderRadius: "6px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold" }}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", background: "#f9f9f9", borderRadius: "8px", border: "1px dashed #ccc" }}>
          <p>No projects found. Create your first one!</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <thead style={{ background: "#f1f1f1", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#555", fontSize: 13 }}>Title</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#555", fontSize: 13 }}>Location</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#555", fontSize: 13 }}>Status</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #eee", color: "#555", fontSize: 13, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#333" }}>{p.title}</td>
                  <td style={{ padding: "12px 16px", color: "#555", fontSize: 14 }}>{p.location}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.is_published ? 
                        <span style={{ fontSize: 11, background: "#dcfce7", color: "#146c2e", padding: "4px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: "bold" }}><Globe size={12}/> Published</span> : 
                        <span style={{ fontSize: 11, background: "#f3f4f6", color: "#4b5563", padding: "4px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: "bold" }}><EyeOff size={12}/> Draft</span>
                      }
                      {p.is_featured && 
                        <span style={{ fontSize: 11, background: "#fef08a", color: "#b45309", padding: "4px 8px", borderRadius: "20px", display: "inline-flex", alignItems: "center", gap: 4, fontWeight: "bold" }}><Star size={12}/> Featured</span>
                      }
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <button onClick={() => handleEdit(p)} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", marginRight: 15, padding: 0 }} title="Edit"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 0 }} title="Delete"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
