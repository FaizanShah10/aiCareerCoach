"use client";

import  { useState } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { LoaderCircle, Trash2, Pencil, Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { saveWorkExperience } from "../../../../../../actions/resume";

const defaultExperience = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
  current: false,
};

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [currentExperience, setCurrentExperience] = useState(defaultExperience);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExperience((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked) => {
    setCurrentExperience((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };

  const addOrUpdateExperience = () => {
    if (!currentExperience.title || !currentExperience.companyName) {
      toast.warning("Please fill out at least the job title and company name.");
      return;
    }

    if (editingIndex !== null) {
      const updated = [...experiences];
      updated[editingIndex] = currentExperience;
      setExperiences(updated);
      setEditingIndex(null);
    } else {
      setExperiences([...experiences, currentExperience]);
    }

    setCurrentExperience(defaultExperience);
    setShowForm(false);
  };

  const editExperience = (index) => {
    setCurrentExperience(experiences[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const removeExperience = (index) => {
    const updated = [...experiences];
    updated.splice(index, 1);
    setExperiences(updated);
  };

  const saveAll = async () => {
    try {
      setLoading(true);
      await saveWorkExperience(experiences);
      toast.success("All experiences saved successfully");
      setExperiences([]);
    } catch (error) {
      toast.error("Error saving experiences");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => {
          setShowForm(!showForm);
          setCurrentExperience(defaultExperience);
          setEditingIndex(null);
        }}>
          
          {showForm ? 
          <p className="flex items-center gap-2">
            <Minus/>
            Cancel
          </p> 
          : 
          <p className="flex items-center gap-2">
            <Plus />
            Add Experience
          </p>
          }
        </Button>
      </div>

      {showForm && (
        <div className="grid grid-cols-2 gap-3 border p-5 rounded-lg mt-4 shadow">
          <Input
            name="title"
            value={currentExperience.title}
            onChange={handleInputChange}
            placeholder="Job Title"
          />
          <Input
            name="companyName"
            value={currentExperience.companyName}
            onChange={handleInputChange}
            placeholder="Company Name"
          />
          <Input
            name="city"
            value={currentExperience.city}
            onChange={handleInputChange}
            placeholder="City"
          />
          <Input
            name="state"
            value={currentExperience.state}
            onChange={handleInputChange}
            placeholder="State"
          />
          <Input
            type="date"
            name="startDate"
            value={currentExperience.startDate}
            onChange={handleInputChange}
          />
          <Input
            type="date"
            name="endDate"
            value={currentExperience.endDate}
            onChange={handleInputChange}
            disabled={currentExperience.current}
          />
          <div className="col-span-2 flex items-center gap-2">
            <Checkbox
              checked={currentExperience.current}
              onCheckedChange={handleCheckboxChange}
            />
            <label className="text-sm">Currently Working</label>
          </div>
          <div className="col-span-2">
            <Textarea
              name="workSummary"
              rows={3}
              value={currentExperience.workSummary}
              onChange={handleInputChange}
              placeholder="Briefly describe your role or achievements"
            />
          </div>
          <div className="col-span-2 text-right">
            <Button onClick={addOrUpdateExperience}>
              {editingIndex !== null ? "Update Experience" : "Add to List"}
            </Button>
          </div>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Experience List</h3>
          {experiences.map((exp, i) => (
            <div key={i} className="border rounded p-4 mb-3 flex justify-between items-start">
              <div>
                <p className="font-semibold">{exp.title} at {exp.companyName}</p>
                <p className="text-sm text-muted-foreground">
                  {[exp.city, exp.state].filter(Boolean).join(", ")}
                </p>
                <p className="text-sm">
                  {exp.startDate} to {exp.current ? "Present" : exp.endDate || "N/A"}
                </p>
                <p className="text-sm mt-1">{exp.workSummary}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" onClick={() => editExperience(i)}>
                  <Pencil size={18} className="text-blue-500" />
                </Button>
                <Button variant="ghost" onClick={() => removeExperience(i)}>
                  <Trash2 size={18} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4">
            <Button disabled={loading} onClick={saveAll}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save All"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
