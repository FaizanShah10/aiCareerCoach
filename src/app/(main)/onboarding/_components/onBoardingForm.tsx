"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { onBoardingSchema } from "@/models/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateUser } from "../../../../../actions/user";
import { z } from "zod";

// Define TypeScript interfaces
interface Industry {
  id: string;
  name: string;
  subIndustries?: string[];
}

interface OnBoardingFormProps {
  industries: Industry[];
}

// Infer the type from the Zod schema
type FormValues = z.infer<typeof onBoardingSchema>;

const OnBoardingForm = ({ industries }: OnBoardingFormProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(onBoardingSchema),
    defaultValues: {
      subIndustry: "", // Provide default value if it's required in schema
    },
  });

  const watchIndustry = watch("industry");

  const onSubmit = async (values: FormValues) => {
    const formattedIndustry = values.subIndustry && values.subIndustry.trim() !== ""
      ? `${values.industry}-${values.subIndustry.toLowerCase().replace(/ /g, "-")}`
      : values.industry;

    setLoading(true);
    try {
      const result = await updateUser({ 
        formattedIndustry, 
        ...values,
        experience: Number(values.experience)
      });

      if (result?.success) {
        toast.success("Profile Successfully Completed");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="lg:text-4xl font-bold gradient-title animate-gradient text-center">
            Complete your profile
          </CardTitle>
          <CardDescription className="text-center">
            Complete your profile for tailored career insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                onValueChange={(value: string) => {
                  setValue("industry", value);
                  setSelectedIndustry(industries.find((i: Industry) => i.id === value) || null);
                  // Reset subIndustry when industry changes
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i: Industry) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">{errors.industry.message}</p>
              )}
            </div>

            {/* Sub Industry */}
            {watchIndustry && selectedIndustry?.subIndustries && selectedIndustry.subIndustries.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select onValueChange={(value: string) => setValue("subIndustry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Specializations</SelectLabel>
                      {selectedIndustry.subIndustries.map((sub: string) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
                )}
              </div>
            )}

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Years of experience"
                {...register("experience", { valueAsNumber: true })}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">{errors.experience.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g. JavaScript, Python"
                {...register("skills")}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="h-32"
                placeholder="Tell us about yourself"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnBoardingForm;