"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { generateAiRoadmap } from "../../../../actions/roadmapGeneration";

import ReactMarkdown from "react-markdown";

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await generateAiRoadmap(data.roadmap);
      setResult(response);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      toast.error("An error occured while generating the roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <div>
        <h1 className="gradient-title animate-gradient text-2xl lg:text-5xl mt-32">
          Roadmap Generation
        </h1>
        <p className="mb-4">Generate a tailored Roadmap</p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-10">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full  lg:w-1/2">
              <div className="grid w-full items-center gap-7">
                <div className="flex flex-col space-y-4">
                  <Label htmlFor="roadmap" className="font-semibold">
                    Enter Roadmap Details You Want
                  </Label>
                  <Textarea
                    className="resize-none"
                    rows={5}
                    {...register("roadmap", { required: true })}
                    id="roadmap"
                    placeholder="e.g Frontend Web Development"
                  />
                </div>
                <Button>
                  {loading ? "Generating..." : "Generate Roadmap"}
                </Button>
              </div>
            </form>

            {/* Generated Result Section */}
            <div className="w-full lg:w-1/2 border border-muted p-4 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold mb-2">Generated Roadmap</h3>
              <div className="prose prose-sm prose-headings:text-xl dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {(result && result.trim()) || "Your generated roadmap will appear here."}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
