"use client";

import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { useState } from "react";


const page = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const file = data.resume[0]
      const description = data.jobDescription

    } catch (error) {
      toast.error("Error occured, try Again")
      console.log(error.message)
    }
  }


  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <div>
        <h1 className="gradient-title animate-gradient text-2xl lg:text-5xl mt-32">
          Resume Ats Analysis
        </h1>
        <p className="mb-4">Get Tailored resume analysis</p>
      </div>

      {/* Form and preview section */}
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form Section */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full lg:w-1/2">
              <div className="grid w-full items-center gap-7">
                {/* File Upload */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="resume">Upload Resume</Label>
                  <Card className="px-4 py-2 rounded-md">
                    <input
                    type="file"
                    accept=".pdf,.jpg,.png,.jpeg"
                    {...register("resume", { required: true })}
                    id="resume"
                  />
                  </Card>
                  {errors.resume && (
                    <p className="text-red-500 text-sm">Resume is required</p>
                  )}
                </div>

                {/* Job Description */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="jobDescription">Enter Job Description</Label>
                  <Textarea
                    rows={5}
                    {...register("jobDescription", { required: true })}
                    id="jobDescription"
                    placeholder="Paste job description here"
                  />
                  {errors.jobDescription && (
                    <p className="text-red-500 text-sm">
                      Job Description is required
                    </p>
                  )}
                </div>
                <Button>
                  {loading ? "Generating..." : "Get Result"}
                </Button>
              </div>

              <div>

              </div>
            </form>

            {/* Generated Result Section */}
            <div className="w-full lg:w-1/2 border border-muted p-4 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold mb-2">Result</h3>
              <div className="prose prose-sm prose-headings:text-xl dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {(result && result.trim()) || "The Result will appear here."}
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
