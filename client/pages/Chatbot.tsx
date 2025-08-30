import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Heart,
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  AlertCircle,
  Lightbulb,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  category?: "nutrition" | "pregnancy" | "lactation" | "general";
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "Hello! I'm your AI nutrition assistant. I'm here to help answer any questions about nutrition during pregnancy and lactation. I can help debunk myths, provide evidence-based information, and give personalized advice based on your health profile. What would you like to know?",
      timestamp: new Date(),
      category: "general",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const suggestedQuestions = [
    {
      question: "Is it safe to eat fish during pregnancy?",
      category: "pregnancy" as const,
    },
    {
      question: "What foods can increase milk supply?",
      category: "lactation" as const,
    },
    {
      question: "Do I need to avoid caffeine completely?",
      category: "nutrition" as const,
    },
    {
      question: "What supplements should I take?",
      category: "nutrition" as const,
    },
    {
      question: "Is spicy food safe while breastfeeding?",
      category: "lactation" as const,
    },
    {
      question: "Can I diet while breastfeeding?",
      category: "lactation" as const,
    },
  ];

  const handleSendMessage = async (message?: string) => {
    const messageText = message || newMessage.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const resp = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!resp.ok) throw new Error("Chat request failed");
      const data = await resp.json();

      const botResponse: Message = {
        id: data.id || (Date.now() + 1).toString(),
        type: "bot",
        content: data.response || "",
        timestamp: new Date(data.timestamp || Date.now()),
        category: data.category || "general",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content:
          "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        category: "general",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      // Remove markdown formatting for clean copy
      const cleanContent = content.replace(/\*\*/g, '');
      await navigator.clipboard.writeText(cleanContent);
      
      // Show visual feedback
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const generateSimulatedResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes("fish") && lowerQuestion.includes("pregnancy")) {
      return "**Low-mercury fish** like salmon and sardines are safe during pregnancy. **Avoid** shark, swordfish, and king mackerel. **Limit to 2-3 servings per week**.";
    }

    if (lowerQuestion.includes("milk supply")) {
      return "**Frequent nursing/pumping** is most important for milk production. **Stay hydrated** and eat adequate calories. **Consult lactation specialist** if concerned.";
    }

    if (lowerQuestion.includes("caffeine")) {
      return "**Limit to 200mg daily** during pregnancy (1 cup coffee). **300mg while breastfeeding** is generally safe. **Monitor baby's response** and reduce if needed.";
    }

    if (
      lowerQuestion.includes("spicy") &&
      (lowerQuestion.includes("breast") || lowerQuestion.includes("milk"))
    ) {
      return "**Spicy foods are safe** while breastfeeding. **No evidence** they harm milk or baby. **Avoid only if** baby shows clear discomfort.";
    }

    if (
      lowerQuestion.includes("diet") &&
      lowerQuestion.includes("breastfeeding")
    ) {
      return "**Need 300-500 extra calories** daily while breastfeeding. **Gradual weight loss** is safe. **Avoid extreme dieting** - focus on nutrient-dense foods.";
    }

    if (lowerQuestion.includes("supplements")) {
      return "**Prenatal vitamin** with folic acid is essential. **Vitamin D and omega-3 DHA** may be needed. **Consult healthcare provider** for personalized recommendations.";
    }

    if (lowerQuestion.includes("almond")) {
      return "**Almonds are nutritious** and safe during pregnancy and breastfeeding. **Rich in protein, fiber, and vitamin E**. **Limit to 1-2 ounces daily** due to high calorie content.";
    }

    return "**For personalized advice**, consult your healthcare provider. **I provide general guidance only** based on evidence-based nutrition information.";
  };

  const categorizeMessage = (message: string): Message["category"] => {
    const lowerMessage = message.toLowerCase();
    
    // Pregnancy-related keywords
    if (lowerMessage.includes("pregnancy") || lowerMessage.includes("pregnant") || lowerMessage.includes("gestation") || 
        lowerMessage.includes("trimester") || lowerMessage.includes("fetus") || lowerMessage.includes("baby") ||
        lowerMessage.includes("delivery") || lowerMessage.includes("labor") || lowerMessage.includes("birth")) {
      return "pregnancy";
    }
    
    // Lactation-related keywords
    if (lowerMessage.includes("breastfeed") || lowerMessage.includes("lactation") || lowerMessage.includes("milk supply") ||
        lowerMessage.includes("nursing") || lowerMessage.includes("breast milk") || lowerMessage.includes("pumping")) {
      return "lactation";
    }
    
    // Nutrition-related keywords (comprehensive)
    if (lowerMessage.includes("nutrition") || lowerMessage.includes("food") || lowerMessage.includes("eat") ||
        lowerMessage.includes("diet") || lowerMessage.includes("meal") || lowerMessage.includes("supplement") ||
        lowerMessage.includes("vitamin") || lowerMessage.includes("mineral") || lowerMessage.includes("protein") ||
        lowerMessage.includes("carbohydrate") || lowerMessage.includes("fat") || lowerMessage.includes("fiber") ||
        lowerMessage.includes("calorie") || lowerMessage.includes("nutrient") || lowerMessage.includes("caffeine") ||
        lowerMessage.includes("coffee") || lowerMessage.includes("tea") || lowerMessage.includes("alcohol") ||
        lowerMessage.includes("fish") || lowerMessage.includes("meat") || lowerMessage.includes("vegetable") ||
        lowerMessage.includes("fruit") || lowerMessage.includes("dairy") || lowerMessage.includes("milk") ||
        lowerMessage.includes("water") || lowerMessage.includes("hydration") || lowerMessage.includes("iron") ||
        lowerMessage.includes("calcium") || lowerMessage.includes("folic acid") || lowerMessage.includes("folate") ||
        lowerMessage.includes("omega") || lowerMessage.includes("dha") || lowerMessage.includes("epa") ||
        lowerMessage.includes("avoid") || lowerMessage.includes("safe") || lowerMessage.includes("unsafe") ||
        lowerMessage.includes("healthy") || lowerMessage.includes("unhealthy") || lowerMessage.includes("organic") ||
        lowerMessage.includes("processed") || lowerMessage.includes("raw") || lowerMessage.includes("cooked") ||
        // Common food items
        lowerMessage.includes("almond") || lowerMessage.includes("walnut") || lowerMessage.includes("cashew") || lowerMessage.includes("peanut") ||
        lowerMessage.includes("rice") || lowerMessage.includes("bread") || lowerMessage.includes("pasta") || lowerMessage.includes("potato") ||
        lowerMessage.includes("tomato") || lowerMessage.includes("carrot") || lowerMessage.includes("spinach") || lowerMessage.includes("broccoli") ||
        lowerMessage.includes("apple") || lowerMessage.includes("banana") || lowerMessage.includes("orange") || lowerMessage.includes("grape") ||
        lowerMessage.includes("chicken") || lowerMessage.includes("beef") || lowerMessage.includes("pork") || lowerMessage.includes("lamb") ||
        lowerMessage.includes("egg") || lowerMessage.includes("cheese") || lowerMessage.includes("yogurt") || lowerMessage.includes("butter") ||
        lowerMessage.includes("sugar") || lowerMessage.includes("salt") || lowerMessage.includes("oil") || lowerMessage.includes("honey") ||
        lowerMessage.includes("chocolate") || lowerMessage.includes("cake") || lowerMessage.includes("cookie") || lowerMessage.includes("ice cream") ||
        // Food-related terms
        lowerMessage.includes("snack") || lowerMessage.includes("breakfast") || lowerMessage.includes("lunch") || lowerMessage.includes("dinner") ||
        lowerMessage.includes("ingredient") || lowerMessage.includes("recipe") || lowerMessage.includes("cooking") || lowerMessage.includes("baking") ||
        lowerMessage.includes("fresh") || lowerMessage.includes("frozen") || lowerMessage.includes("canned") || lowerMessage.includes("dried") ||
        lowerMessage.includes("spice") || lowerMessage.includes("herb") || lowerMessage.includes("seasoning") || lowerMessage.includes("flavor") ||
        // Health-related food terms
        lowerMessage.includes("benefit") || lowerMessage.includes("good") || lowerMessage.includes("bad") || lowerMessage.includes("harmful") ||
        lowerMessage.includes("nutritious") || lowerMessage.includes("wholesome") || lowerMessage.includes("natural") || lowerMessage.includes("artificial")) {
      return "nutrition";
    }
    
    return "general";
  };

  const getCategoryColor = (category: Message["category"]) => {
    switch (category) {
      case "pregnancy":
        return "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300";
      case "lactation":
        return "bg-lavender-100 dark:bg-lavender-900/30 text-lavender-700 dark:text-lavender-300";
      case "nutrition":
        return "bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300";
      default:
        return "bg-peach-100 dark:bg-peach-900/30 text-peach-700 dark:text-peach-300";
    }
  };

  const formatBotMessage = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      // Check if it's a numbered list
      if (paragraph.match(/^\d+\)/)) {
        return (
          <div key={index} className="mb-3">
            <div className="font-semibold text-rose-700 dark:text-rose-300 mb-2">
              {paragraph.split(':')[0]}:
            </div>
            {paragraph.split(':')[1] && (
              <div className="text-rose-900 dark:text-rose-100 ml-4">
                {paragraph.split(':')[1]}
              </div>
            )}
          </div>
        );
      }
      
      // Check if it's a bullet list
      if (paragraph.includes('•') || paragraph.includes('*')) {
        const items = paragraph.split(/(?<=^|\n)(?=\s*[•*])/);
        return (
          <div key={index} className="mb-3">
            {items.map((item, itemIndex) => {
              if (!item.trim()) return null;
              const cleanItem = item.replace(/^[\s•*]+/, '').trim();
              if (!cleanItem) return null;
              
              return (
                <div key={itemIndex} className="flex items-start mb-2">
                  <span className="inline-block w-2 h-2 bg-rose-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-rose-900 dark:text-rose-100">{formatBoldText(cleanItem)}</span>
                </div>
              );
            })}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-3 text-rose-900 dark:text-rose-100 leading-relaxed">
          {formatBoldText(paragraph)}
        </div>
      );
    });
  };

  const formatBoldText = (text: string) => {
    // More robust bold text formatting
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2); // Remove ** from start and end
        return (
          <strong key={index} className="font-semibold text-rose-700 dark:text-rose-300">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-r from-rose-500 to-lavender-500 p-2 rounded-full">
              <Bot className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mb-1">
            AI Nutrition Assistant
          </h1>
          <p className="text-sm text-rose-700 dark:text-rose-300 max-w-xl mx-auto">
            Get evidence-based answers to your nutrition questions during
            pregnancy and lactation
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-rose-100 dark:border-gray-700 shadow-lg h-[500px] flex flex-col">
              <CardHeader className="border-b border-rose-100 dark:border-gray-700 bg-gradient-to-r from-rose-50 to-lavender-50 dark:from-gray-800 dark:to-gray-700 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center text-rose-900 dark:text-rose-100 text-lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Nutrition Chat
                    </CardTitle>
                    <CardDescription className="text-rose-600 dark:text-rose-400 text-sm">
                      Ask me anything about nutrition, pregnancy, and lactation
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-0" ref={scrollAreaRef}>
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-2 ${
                        message.type === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <Avatar className="w-8 h-8 border border-white dark:border-gray-600">
                          <AvatarFallback
                            className={
                              message.type === "user"
                                ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white"
                                : "bg-gradient-to-br from-lavender-500 to-lavender-600 text-white"
                            }
                          >
                            {message.type === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Message Content */}
                      <div
                        className={`flex flex-col max-w-[80%] ${
                          message.type === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Name and Time */}
                        <div
                          className={`flex items-center gap-1 mb-1 ${
                            message.type === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <span className="text-xs font-medium text-rose-900 dark:text-rose-100">
                            {message.type === "user"
                              ? user?.name || "You"
                              : "AI Assistant"}
                          </span>
                          <span className="text-xs text-rose-500 dark:text-rose-400">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`relative px-4 py-3 rounded-xl shadow-sm ${
                            message.type === "user"
                              ? "bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-br-sm"
                              : "bg-white dark:bg-gray-700 border border-rose-100 dark:border-gray-600 text-rose-900 dark:text-rose-100 rounded-bl-sm"
                          }`}
                        >
                          {/* Copy Button for Bot Messages */}
                          {message.type === "bot" && (
                            <button
                              onClick={() => handleCopyMessage(message.content, message.id)}
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-rose-50 dark:bg-gray-600 hover:bg-rose-100 dark:hover:bg-gray-500 transition-colors duration-200 group"
                              title={copiedMessageId === message.id ? "Copied!" : "Copy message"}
                            >
                              {copiedMessageId === message.id ? (
                                <div className="h-3 w-3 text-green-600 dark:text-green-300 flex items-center justify-center">
                                  ✓
                                </div>
                              ) : (
                                <Copy className="h-3 w-3 text-rose-600 dark:text-rose-300 group-hover:text-rose-700 dark:group-hover:text-rose-200" />
                              )}
                            </button>
                          )}
                          
                          <div
                            className={`text-sm leading-relaxed ${
                              message.type === "bot" ? "space-y-3" : ""
                            }`}
                          >
                            {message.type === "bot" ? (
                              <div className="prose prose-sm max-w-none">
                                {formatBotMessage(message.content)}
                              </div>
                            ) : (
                              <span className="whitespace-pre-wrap">
                                {message.content}
                              </span>
                            )}
                          </div>

                          {/* Category Badge for Bot Messages */}
                          {message.category && message.type === "bot" && (
                            <div className="mt-2 pt-2 border-t border-rose-100 dark:border-gray-600">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getCategoryColor(message.category)}`}
                              >
                                {message.category}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Animation */}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        <Avatar className="w-8 h-8 border border-white dark:border-gray-600">
                          <AvatarFallback className="bg-gradient-to-br from-lavender-500 to-lavender-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-white dark:bg-gray-700 border border-rose-100 dark:border-gray-600 rounded-xl rounded-bl-sm px-3 py-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-rose-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your nutrition question here..."
                      className="border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-rose-500 dark:focus:border-rose-400 rounded-xl px-3 py-2 text-sm h-9"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl px-4 py-2 h-9 disabled:opacity-50"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Questions */}
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-rose-100 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-rose-900 dark:text-rose-100 flex items-center text-lg">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Quick Questions
                </CardTitle>
                <CardDescription className="text-rose-600 dark:text-rose-400 text-sm">
                  Popular nutrition topics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid gap-3">
                  {suggestedQuestions.map((item, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer rounded-lg border border-rose-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-rose-50 dark:hover:bg-gray-700 hover:border-rose-300 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-md"
                      onClick={() => handleSendMessage(item.question)}
                    >
                      <div className="flex items-center justify-between p-4">
                        {/* Question Text - Left Aligned */}
                        <div className="flex-1 pr-4">
                          <p className="text-sm font-medium text-rose-700 dark:text-rose-300 group-hover:text-rose-900 dark:group-hover:text-rose-100 leading-relaxed text-left">
                            {item.question}
                          </p>
                        </div>

                        {/* Category Badge - Right Aligned and Vertically Centered */}
                        <div className="flex-shrink-0 flex items-center">
                          <Badge
                            className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(item.category)}`}
                          >
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-peach-50 to-peach-100 dark:from-peach-900/20 dark:to-peach-800/20 border-peach-200 dark:border-peach-700">
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-4 w-4 text-peach-600 dark:text-peach-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-peach-900 dark:text-peach-100 mb-1 text-sm">
                      Pro Tips
                    </h4>
                    <ul className="text-xs text-peach-800 dark:text-peach-200 space-y-0.5">
                      <li>• Be specific about your situation</li>
                      <li>• Ask about particular foods or nutrients</li>
                      <li>• Mention your pregnancy stage or baby's age</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer Card */}
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-700">
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1 text-sm">
                      Medical Disclaimer
                    </h4>
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                      This AI provides general information only. Always consult
                      your healthcare provider for personalized medical advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
