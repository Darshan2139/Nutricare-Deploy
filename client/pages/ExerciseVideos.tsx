import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Clock,
  Info,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";
import { toast } from "sonner";

interface ExerciseVideo {
  id: number;
  title: string;
  url: string;
  duration: string;
  category: "stretches" | "cardio" | "yoga" | "pilates";
  trimester: "all" | "first" | "second" | "third";
  description: string;
  benefits: string[];
  tips: string[];
}

const exerciseVideos: ExerciseVideo[] = [
  {
    id: 1,
    title:
      "Pregnancy Stretches To Prepare For An Easy Delivery (Natural Birth Preparation)",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751472759/SSYouTube.online_Pregnancy_Stretches_To_Prepare_For_An_Easy_Delivery_Natural_Birth_Preparation__720p_venyzc.mp4",
    duration: "15 min",
    category: "stretches",
    trimester: "all",
    description:
      "Essential stretches to prepare your body for natural birth and improve flexibility during pregnancy.",
    benefits: [
      "Improves pelvic flexibility",
      "Reduces labor pain",
      "Strengthens birthing muscles",
    ],
    tips: [
      "Hold each stretch for 30 seconds",
      "Breathe deeply throughout",
      "Stop if you feel dizzy",
    ],
  },
  {
    id: 2,
    title: "Pregnancy Cardio Workout TO THE BEAT [Fun & Easy To Follow!]",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751472673/SSYouTube.online_Pregnancy_Cardio_Workout_TO_THE_BEAT_Fun_Easy_To_Follow__480p_b2sohe.mp4",
    duration: "20 min",
    category: "cardio",
    trimester: "second",
    description:
      "Fun, low-impact cardio workout designed to keep you energized and healthy during pregnancy.",
    benefits: [
      "Boosts energy levels",
      "Improves cardiovascular health",
      "Enhances mood",
    ],
    tips: [
      "Stay hydrated",
      "Modify intensity as needed",
      "Listen to your body",
    ],
  },
  {
    id: 3,
    title: "15-Minute Pregnancy Workout [Feel Energized!]",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751472556/SSYouTube.online_15_Minute_Pregnancy_Workout_1st_Trimester_2nd_Trimester_3rd_Trimester__480p_rfw6wc.mp4",
    duration: "15 min",
    category: "cardio",
    trimester: "all",
    description:
      "Complete workout suitable for all trimesters to maintain fitness and energy throughout pregnancy.",
    benefits: [
      "Maintains fitness",
      "Increases energy",
      "Supports healthy weight gain",
    ],
    tips: ["Start slowly", "Focus on form", "Take breaks when needed"],
  },
  {
    id: 4,
    title:
      "Best Pregnancy Stretches - 10-Min Full-Body Daily Stretch Routine [Relieve Pregnancy Symptoms]",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751472317/SSYouTube.online_Best_Pregnancy_Stretches_10-Min_Full-Body_Daily_Stretch_Routine_Relieve_Pregnancy_Symptoms_720p_iksdjt.mp4",
    duration: "10 min",
    category: "stretches",
    trimester: "all",
    description:
      "Daily full-body stretching routine to alleviate common pregnancy discomforts and maintain flexibility.",
    benefits: [
      "Relieves back pain",
      "Reduces swelling",
      "Improves sleep quality",
    ],
    tips: ["Practice daily", "Use props for support", "Never force a stretch"],
  },
  {
    id: 5,
    title:
      "Prenatal Deep Core Pilates To Prepare For a Shorter Pushing Time (Safe Pregnancy Core Exercises)",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751472217/SSYouTube.online_Prenatal_Deep_Core_Pilates_To_Prepare_For_a_Shorter_Pushing_Time_Safe_Pregnancy_Core_Exercises__720p_fgzhvh.mp4",
    duration: "18 min",
    category: "pilates",
    trimester: "second",
    description:
      "Safe core strengthening exercises to prepare for labor and improve pushing efficiency.",
    benefits: [
      "Strengthens deep core muscles",
      "Improves pushing power",
      "Supports posture",
    ],
    tips: ["Engage pelvic floor", "Avoid lying flat", "Focus on breathing"],
  },
  {
    id: 6,
    title: "Feel Amazing After This 15-Min Prenatal Yoga For Morning Time!",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751470764/SSYouTube.online_Feel_Amazing_After_This_15-Min_Prenatal_Yoga_For_Morning_Time__720p_jtzh1p.mp4",
    duration: "15 min",
    category: "yoga",
    trimester: "all",
    description:
      "Gentle morning yoga routine to start your day with energy and mindfulness during pregnancy.",
    benefits: [
      "Reduces morning stiffness",
      "Increases energy",
      "Promotes mindfulness",
    ],
    tips: [
      "Practice on empty stomach",
      "Use blocks for support",
      "Move slowly",
    ],
  },
  {
    id: 7,
    title: "10 Pregnancy Stretches You Need To Be Doing Everyday!",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751470298/SSYouTube.online_10_Pregnancy_Stretches_You_Need_To_Be_Doing_Everyday__720p_mitbip.mp4",
    duration: "12 min",
    category: "stretches",
    trimester: "all",
    description:
      "Essential daily stretches every pregnant woman should incorporate into their routine for optimal comfort.",
    benefits: [
      "Prevents muscle tension",
      "Improves circulation",
      "Enhances flexibility",
    ],
    tips: ["Hold for 20-30 seconds", "Breathe deeply", "Don't bounce"],
  },
  {
    id: 8,
    title:
      "15-Minute Pregnancy Yoga - First, Second & Third Trimester Prenatal Yoga",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751470295/SSYouTube.online_15-Minute_Pregnancy_Yoga___First_Second_Third_Trimester_Prenatal_Yoga_720p_qqs5yo.mp4",
    duration: "15 min",
    category: "yoga",
    trimester: "all",
    description:
      "Comprehensive yoga practice adapted for each trimester with modifications for safety and comfort.",
    benefits: [
      "Reduces stress",
      "Improves flexibility",
      "Supports emotional well-being",
    ],
    tips: ["Modify as needed", "Use props", "Listen to your body"],
  },
  {
    id: 9,
    title: "First Trimester Prenatal Yoga To Relieve Nausea & Morning Sickness",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751470266/SSYouTube.online_First_Trimester_Prenatal_Yoga_To_Relieve_Nausea_Morning_Sickness_720p_hj1l56.mp4",
    duration: "12 min",
    category: "yoga",
    trimester: "first",
    description:
      "Gentle yoga poses specifically designed to alleviate nausea and morning sickness in early pregnancy.",
    benefits: ["Reduces nausea", "Calms nervous system", "Improves digestion"],
    tips: ["Practice slowly", "Focus on breathing", "Stop if nauseous"],
  },
  {
    id: 10,
    title:
      "Best Pregnancy Stretches - 15-Min Full-Body Daily Stretch Routine [Relieve Pregnancy Symptoms]",
    url: "https://res.cloudinary.com/dwwz3edan/video/upload/v1751470118/SSYouTube.online_Best_Pregnancy_Stretches_15-Min_Full-Body_Daily_Stretch_Routine_Relieve_Pregnancy_Symptoms_720p_cdbyso.mp4",
    duration: "15 min",
    category: "stretches",
    trimester: "all",
    description:
      "Comprehensive stretching routine targeting all major muscle groups to relieve pregnancy-related discomfort.",
    benefits: [
      "Full-body relief",
      "Improves posture",
      "Reduces pregnancy aches",
    ],
    tips: ["Practice daily", "Use wall support", "Stay hydrated"],
  },
];

export default function ExerciseVideos() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTrimester, setSelectedTrimester] = useState<string>("all");

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const currentVideo = exerciseVideos[currentVideoIndex];

  // Filter videos based on selected category and trimester
  const filteredVideos = exerciseVideos.filter((video) => {
    const categoryMatch =
      selectedCategory === "all" || video.category === selectedCategory;
    const trimesterMatch =
      selectedTrimester === "all" ||
      video.trimester === selectedTrimester ||
      video.trimester === "all";
    return categoryMatch && trimesterMatch;
  });

  // Update current video index when filters change
  useEffect(() => {
    if (!filteredVideos.find((video) => video.id === currentVideo.id)) {
      setCurrentVideoIndex(0);
    } else {
      const newIndex = filteredVideos.findIndex(
        (video) => video.id === currentVideo.id,
      );
      setCurrentVideoIndex(newIndex);
    }
  }, [selectedCategory, selectedTrimester]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const goToNextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % filteredVideos.length;
    setCurrentVideoIndex(nextIndex);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const goToPreviousVideo = () => {
    const prevIndex =
      currentVideoIndex === 0
        ? filteredVideos.length - 1
        : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "yoga":
        return "bg-lavender-100 text-lavender-700 dark:bg-lavender-900/30 dark:text-lavender-300";
      case "stretches":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
      case "cardio":
        return "bg-peach-100 text-peach-700 dark:bg-peach-900/30 dark:text-peach-300";
      case "pilates":
        return "bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getTrimesterColor = (trimester: string) => {
    switch (trimester) {
      case "first":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "second":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "third":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Keyboard shortcuts for video player
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only work if user is not typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as any)?.contentEditable === "true"
      ) {
        return;
      }

      // Only work on exercise videos page
      if (!window.location.pathname.includes("/exercise-videos")) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPreviousVideo();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNextVideo();
          break;
        case "f":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case "m":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleMute();
          }
          break;
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "j":
          e.preventDefault();
          goToPreviousVideo();
          break;
        case "l":
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            goToNextVideo();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying, currentVideoIndex]);

  if (!filteredVideos.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <EnhancedNavbar />
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="p-8">
            <CardContent className="text-center">
              <Heart className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-rose-900 mb-2">
                No videos found
              </h3>
              <p className="text-rose-600">
                Try adjusting your filters to see more exercise videos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayVideo = filteredVideos[currentVideoIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-rose-500 dark:text-rose-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-rose-900 dark:text-rose-100">
              Prenatal Exercise Videos
            </h1>
          </div>
          <p className="text-lg text-rose-700 dark:text-rose-300 max-w-3xl mx-auto">
            Safe, gentle exercises designed specifically for pregnant women.
            Follow along with expert-guided workouts to stay healthy, reduce
            discomfort, and prepare for labor.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <div className="flex gap-2">
            <span className="text-sm font-medium text-rose-700 dark:text-rose-300 self-center">
              Category:
            </span>
            {["all", "yoga", "stretches", "cardio", "pilates"].map(
              (category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-rose-500 hover:bg-rose-600"
                      : "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-gray-600 dark:text-rose-300"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ),
            )}
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-medium text-rose-700 dark:text-rose-300 self-center">
              Trimester:
            </span>
            {["all", "first", "second", "third"].map((trimester) => (
              <Button
                key={trimester}
                variant={
                  selectedTrimester === trimester ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedTrimester(trimester)}
                className={
                  selectedTrimester === trimester
                    ? "bg-lavender-500 hover:bg-lavender-600"
                    : "border-lavender-200 text-lavender-700 hover:bg-lavender-50 dark:border-gray-600 dark:text-lavender-300"
                }
              >
                {trimester.charAt(0).toUpperCase() + trimester.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-rose-100 dark:border-gray-700 shadow-2xl overflow-hidden">
              {/* Video Title */}
              <CardHeader className="bg-gradient-to-r from-rose-500 to-lavender-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold leading-tight">
                      {displayVideo.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        className={getCategoryColor(displayVideo.category)}
                      >
                        {displayVideo.category}
                      </Badge>
                      <Badge
                        className={getTrimesterColor(displayVideo.trimester)}
                      >
                        {displayVideo.trimester === "all"
                          ? "All Trimesters"
                          : `${displayVideo.trimester} Trimester`}
                      </Badge>
                      <div className="flex items-center text-white/90">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{displayVideo.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Video Container */}
              <div
                ref={containerRef}
                className="relative group bg-black"
                onMouseEnter={() => setShowOverlay(true)}
                onMouseLeave={() => setShowOverlay(false)}
              >
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full aspect-video"
                  src={displayVideo.url}
                  onLoadStart={() => setIsLoading(true)}
                  onCanPlay={() => setIsLoading(false)}
                  onTimeUpdate={(e) =>
                    setCurrentTime((e.target as HTMLVideoElement).currentTime)
                  }
                  onLoadedMetadata={(e) =>
                    setDuration((e.target as HTMLVideoElement).duration)
                  }
                  onEnded={goToNextVideo}
                  onClick={togglePlay}
                />

                {/* Video Controls Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${showOverlay || !isPlaying ? "opacity-100" : "opacity-0"}`}
                >
                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/50 transition-all duration-300 hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white ml-1" />
                      )}
                    </Button>
                  </div>

                  {/* Top Controls */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowOverlay(!showOverlay)}
                      className="bg-black/30 hover:bg-black/50 text-white"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="bg-black/30 hover:bg-black/50 text-white"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        className="flex-1 h-1 bg-white/30 rounded-lg appearance-none slider"
                      />
                      <span>{formatTime(duration)}</span>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={goToPreviousVideo}
                          className="text-white hover:bg-white/20"
                        >
                          <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={togglePlay}
                          className="text-white hover:bg-white/20"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={goToNextVideo}
                          className="text-white hover:bg-white/20"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleMute}
                          className="text-white hover:bg-white/20"
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-white/30 rounded-lg appearance-none slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pause Overlay with Tips */}
                {!isPlaying && !isLoading && showOverlay && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm max-w-md mx-4">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-rose-900 dark:text-rose-100 mb-3">
                          Exercise Benefits
                        </h3>
                        <ul className="space-y-2 text-sm text-rose-700 dark:text-rose-300">
                          {displayVideo.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <Heart className="h-4 w-4 text-rose-500 mr-2 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            {/* Video Description */}
            <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-rose-100 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100 mb-3">
                  About This Exercise
                </h3>
                <p className="text-rose-700 dark:text-rose-300 mb-4">
                  {displayVideo.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">
                      Benefits
                    </h4>
                    <ul className="space-y-1">
                      {displayVideo.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-sm text-rose-700 dark:text-rose-300 flex items-start"
                        >
                          <Heart className="h-3 w-3 text-rose-500 mr-2 mt-1 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">
                      Safety Tips
                    </h4>
                    <ul className="space-y-1">
                      {displayVideo.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="text-sm text-rose-700 dark:text-rose-300 flex items-start"
                        >
                          <Info className="h-3 w-3 text-rose-500 mr-2 mt-1 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Playlist */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-rose-100 dark:border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-rose-900 dark:text-rose-100 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Exercise Playlist
                </CardTitle>
                <CardDescription className="text-rose-600 dark:text-rose-400">
                  {filteredVideos.length} videos available
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto">
                  {filteredVideos.map((video, index) => (
                    <div
                      key={video.id}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`p-4 border-b border-rose-100 dark:border-gray-700 cursor-pointer transition-all duration-200 hover:bg-rose-50 dark:hover:bg-gray-700 ${
                        index === currentVideoIndex
                          ? "bg-rose-100 dark:bg-gray-700 border-l-4 border-l-rose-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium text-sm leading-tight mb-1 ${
                              index === currentVideoIndex
                                ? "text-rose-900 dark:text-rose-100"
                                : "text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge className={getCategoryColor(video.category)}>
                              {video.category}
                            </Badge>
                            <span className="text-rose-500 dark:text-rose-400">
                              {video.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Keyboard Shortcuts */}
            <Card className="bg-gradient-to-br from-lavender-50 to-peach-50 dark:from-lavender-900/20 dark:to-peach-900/20 border-lavender-200 dark:border-lavender-700">
              <CardContent className="p-4">
                <h4 className="font-semibold text-lavender-900 dark:text-lavender-100 mb-3 text-sm">
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-1 text-xs text-lavender-700 dark:text-lavender-300">
                  <div className="flex justify-between">
                    <span>Play/Pause</span>
                    <div className="space-x-1">
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        Space
                      </kbd>
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        K
                      </kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Previous Video</span>
                    <div className="space-x-1">
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        ←
                      </kbd>
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        J
                      </kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Video</span>
                    <div className="space-x-1">
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        →
                      </kbd>
                      <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                        L
                      </kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Mute</span>
                    <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                      M
                    </kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Fullscreen</span>
                    <kbd className="bg-lavender-200 dark:bg-lavender-800 px-1 rounded text-xs">
                      F
                    </kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Custom CSS for sliders */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
