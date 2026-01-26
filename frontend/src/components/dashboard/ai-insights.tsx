"use client";

import {
  CheckCircle2,
  List,
  Brain,
  Clipboard,
  CircleSmall,
  Mic,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalysisData } from "@/lib/types";
import { TranscriptView } from "./transcript-view";
import ClipButton from "../ui/clipboardbutton";

export const AIInsights = ({ ...insightData }: AnalysisData) => {
  return (
    <div className="space-y-6  ">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between ">
        {/*<div className="">
          <h1 className="text-2xl font-bold text-foreground relative">
            {`${insightData?.ai_title || "Processed Video"} `}
            <span className="absolute  text-sidebar-foreground italic text-xs px-1 bg-sidebar-accent rounded-full">Generated</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Analysis Complete
            </Badge>
          </div>
        </div>*/}
      </div>

      {/* 2. The Meat: Summary & Tasks */}
      <Tabs defaultValue="summary" className="w-full mt-6">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-3  gap-1 h-fit  ">
          <TabsTrigger value="summary" className="w-full">
            Summary
          </TabsTrigger>
          {
            insightData?.transcriptData &&( <TabsTrigger value="transcript" className="md:hidden">
              Transcript
            </TabsTrigger>)
          }
         
          <TabsTrigger value="action_items">Actions</TabsTrigger>
          <TabsTrigger value="takeaways">Key Points</TabsTrigger>
        </TabsList>

        {/* Tab 1: Executive Summary */}
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <span>Executive Summary</span>
                </div>
                <ClipButton text={insightData?.summary} tabName="Summary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-secondary-foreground/70 text-justify ">
                {insightData?.summary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Action Items */}
        <TabsContent value="action_items" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span>Tasks & To-Dos</span>
                </div>
                <ClipButton
                  text={insightData?.action_items.join("\n")}
                  tabName="Actions"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-auto">
              <ul className="space-y-3">
                {insightData?.action_items?.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-secondary-foreground/70">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Key Takeaways */}
        <TabsContent value="takeaways" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-orange-500" />
                  <span>Key Points</span>
                </div>
                <ClipButton
                  text={insightData?.key_takeaways?.join(", ")}
                  tabName="TakeAways"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] overflow-auto">
              <ul className="space-y-2 list-disc pl-5">
                {insightData?.key_takeaways?.map((point, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CircleSmall className="w-3 h-3 text-primary mt-2 shrink-0" />

                    <span className="text-secondary-foreground/70 leading-relaxed ">
                      {point}.
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Transcript for Mobile View */}
        {
          insightData?.transcriptData && (
            <TabsContent value="transcript" className="mt-4 md:hidden">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-blue-500" />
                      <h3 className="font-semibold flex items-center gap-2">
                        Transcript
                        <span className="text-xs font-normal truncate bg-primary/10 px-2 py-0.5 rounded-full text-primary">
                          {insightData.transcriptData?.segments?.length} segments
                        </span>
                      </h3>
                    </div>
                    <ClipButton
                    text={insightData?.transcriptData?.segments?.flatMap(segment => segment.text).join(' ')}
                      tabName="Transcript"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] overflow-auto">
                  <TranscriptView
                    segments={insightData?.transcriptData?.segments}
                    onSeek={insightData?.transcriptData?.onSeek}
                    currentTime={insightData.transcriptData?.currentTime}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )
        }
       
      </Tabs>
    </div>
  );
};
