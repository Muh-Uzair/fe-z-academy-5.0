"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignUpInstructor from "@/features/auth-and-user-management/SignUpInstructor";
import SignUpStudent from "@/features/auth-and-user-management/SignUpStudent";

const SignUp = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Choose how you want to create your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full gap-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student Sign Up</TabsTrigger>
              <TabsTrigger value="instructor">Instructor Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <SignUpStudent />
            </TabsContent>

            <TabsContent value="instructor">
              <SignUpInstructor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;

