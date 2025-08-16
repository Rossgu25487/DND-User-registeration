"use client";

import { useState } from "react";
import {
  Wand2,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { generateStrongPassword } from "@/ai/flows/generate-password";
import { useToast } from "@/hooks/use-toast";

type PasswordGeneratorProps = {
  onPasswordGenerated: (password: string) => void;
};

export function PasswordGenerator({
  onPasswordGenerated
}: PasswordGeneratorProps) {
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleGeneratePassword = async () => {
    setIsLoading(true);
    setGeneratedPassword("");
    try {
      const result = await generateStrongPassword({
        length,
        includeNumbers,
        includeSymbols,
      });
      if (result.password) {
        setGeneratedPassword(result.password);
      } else {
        throw new Error("Failed to generate password.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not generate a password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="bg-muted/50 border-dashed shadow-inner">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Password Generator</CardTitle>
        <CardDescription className="text-xs">
          Create a strong and secure password for your vault.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="length" className="text-sm">Password Length</Label>
            <span className="text-sm font-medium text-primary">{length}</span>
          </div>
          <Slider
            id="length"
            min={8}
            max={64}
            step={1}
            value={[length]}
            onValueChange={([val]) => setLength(val)}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="include-numbers" className="text-sm">Include Numbers</Label>
          <Switch
            id="include-numbers"
            checked={includeNumbers}
            onCheckedChange={setIncludeNumbers}
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="include-symbols" className="text-sm">Include Symbols</Label>
          <Switch
            id="include-symbols"
            checked={includeSymbols}
            onCheckedChange={setIncludeSymbols}
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleGeneratePassword}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Password
        </Button>

        {generatedPassword && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={generatedPassword}
                className="font-code text-base"
                aria-label="Generated Password"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyToClipboard}
                aria-label="Copy password"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => onPasswordGenerated(generatedPassword)}
            >
              Use This Password
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
