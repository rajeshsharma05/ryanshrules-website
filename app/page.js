'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Lock, LogOut, Plus, Trash2, Edit2, Save, X, Menu, ArrowRight, Play, Grid, Film, Palette, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../lib/supabase';

// Image Upload Component
const ImageUploader = ({ onImageUpload, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setUploading(true);

        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `comics/${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onImageUpload(publicUrl);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: false
    });

    return (
        <div className="mb-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                }`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div className="space-y-4">
                        <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        <p className="text-sm text-gray-600">Click or drag to replace image</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                            <p className="text-sm font-medium">
                                {isDragActive ? 'Drop the image here' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Take a photo of the comic strip and upload here
                            </p>
                        </div>
                    </div>
                )}
                {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                )}
            </div>
        </div>
    );
};

// Main App Component
export default function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [currentSection, setCurrentSection] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loading, setLoading] = useState(true);

    // Content state
    const [comics, setComics] = useState([]);
    const [videos, setVideos] = useState([]);
    const [editingComic, setEditingComic] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [viewingComic, setViewingComic] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Notification state
    const [notification, setNotification] = useState(null);

    // Temporary storage for edits
    const [tempComicData, setTempComicData] = useState({});
    const [tempVideoData, setTempVideoData] = useState({});

    // Show notification helper
    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Load data from Supabase
    useEffect(() => {
        loadContent();
        checkAdminStatus();
    }, []);

    const loadContent = async () => {
        try {
            // Load comics
            const { data: comicsData, error: comicsError } = await supabase
                .from('comics')
                .select('*')
                .order('created_at', { ascending: false });

            if (comicsError) throw comicsError;
            setComics(comicsData || []);

            // Load videos
            const { data: videosData, error: videosError } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (videosError) throw videosError;
            setVideos(videosData || []);
        } catch (error) {
            console.error('Error loading content:', error);
            // Fallback to demo content if database is not set up
            setComics([
                { id: 1, title: "Space Adventures", date: "September 2024", image_url: "https://via.placeholder.com/800x600/000000/FFFFFF?text=Space+Adventures" },
                { id: 2, title: "Robot Friends", date: "September 2024", image_url: "https://via.placeholder.com/800x600/222222/FFFFFF?text=Robot+Friends" }
            ]);
            setVideos([
                { id: 1, title: "My Drawing Process", date: "September 2024", youtube_id: "dQw4w9WgXcQ" },
                { id: 2, title: "Dance Performance", date: "August 2024", youtube_id: "dQw4w9WgXcQ" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const checkAdminStatus = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsAdmin(true);
                localStorage.setItem('ryansh_admin', 'true');
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
    };

    // Admin login handler
    const handleLogin = async () => {
        try {
            // Authenticate with Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginUsername,
                password: loginPassword
            });

            if (error) {
                console.error('Login error:', error);
                showNotification('Invalid credentials. Please check your email and password.', 'error');
            } else {
                // Successful Supabase auth
                setIsAdmin(true);
                setShowLogin(false);
                localStorage.setItem('ryansh_admin', 'true');
                setLoginUsername('');
                setLoginPassword('');
                showNotification('Successfully logged in!', 'success');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('Login failed. Please try again.', 'error');
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
        setIsAdmin(false);
        localStorage.removeItem('ryansh_admin');
    };

    // Add new comic
    const addComic = () => {
        const newComic = {
            id: `temp_${Date.now()}`,
            title: "New Comic Strip",
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            image_url: "",
            is_temp: true
        };
        setComics([newComic, ...comics]);
        setEditingComic(newComic.id);
        setTempComicData({ [newComic.id]: newComic });
    };

    // Add new video
    const addVideo = () => {
        const newVideo = {
            id: `temp_${Date.now()}`,
            title: "New Video",
            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            youtube_id: "",
            is_temp: true
        };
        setVideos([newVideo, ...videos]);
        setEditingVideo(newVideo.id);
        setTempVideoData({ [newVideo.id]: newVideo });
    };

    // Save comic to database
    const saveComic = async (comic) => {
        try {
            const comicData = {
                title: comic.title,
                date: comic.date,
                image_url: comic.image_url
            };

            if (comic.is_temp) {
                // Insert new comic
                const { data, error } = await supabase
                    .from('comics')
                    .insert([comicData])
                    .select()
                    .single();

                if (error) throw error;

                // Update local state with real ID
                setComics(comics.map(c => c.id === comic.id ? data : c));
                setTempComicData({});
            } else {
                // Update existing comic
                const { error } = await supabase
                    .from('comics')
                    .update(comicData)
                    .eq('id', comic.id);

                if (error) throw error;
            }

            setEditingComic(null);
            showNotification('Comic saved successfully!');
        } catch (error) {
            console.error('Error saving comic:', error);
            showNotification('Failed to save comic. Please try again.', 'error');
        }
    };

    // Save video to database
    const saveVideo = async (video) => {
        try {
            const videoData = {
                title: video.title,
                date: video.date,
                youtube_id: video.youtube_id
            };

            if (video.is_temp) {
                // Insert new video
                const { data, error } = await supabase
                    .from('videos')
                    .insert([videoData])
                    .select()
                    .single();

                if (error) throw error;

                // Update local state with real ID
                setVideos(videos.map(v => v.id === video.id ? data : v));
                setTempVideoData({});
            } else {
                // Update existing video
                const { error } = await supabase
                    .from('videos')
                    .update(videoData)
                    .eq('id', video.id);

                if (error) throw error;
            }

            setEditingVideo(null);
            showNotification('Video saved successfully!');
        } catch (error) {
            console.error('Error saving video:', error);
            showNotification('Failed to save video. Please try again.', 'error');
        }
    };

    // Update comic locally
    const updateComic = (id, field, value) => {
        if (tempComicData[id]) {
            setTempComicData({
                ...tempComicData,
                [id]: { ...tempComicData[id], [field]: value }
            });
        }
        setComics(comics.map(comic =>
            comic.id === id ? { ...comic, [field]: value } : comic
        ));
    };

    // Update video locally
    const updateVideo = (id, field, value) => {
        if (tempVideoData[id]) {
            setTempVideoData({
                ...tempVideoData,
                [id]: { ...tempVideoData[id], [field]: value }
            });
        }
        setVideos(videos.map(video =>
            video.id === id ? { ...video, [field]: value } : video
        ));
    };

    // Delete comic
    const deleteComic = async (id) => {
        if (!window.confirm('Are you sure you want to delete this comic?')) return;

        try {
            if (!id.toString().startsWith('temp_')) {
                const { error } = await supabase
                    .from('comics')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }

            setComics(comics.filter(comic => comic.id !== id));
            showNotification('Comic deleted successfully!');
        } catch (error) {
            console.error('Error deleting comic:', error);
            showNotification('Failed to delete comic. Please try again.', 'error');
        }
    };

    // Delete video
    const deleteVideo = async (id) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;

        try {
            if (!id.toString().startsWith('temp_')) {
                const { error } = await supabase
                    .from('videos')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
            }

            setVideos(videos.filter(video => video.id !== id));
            showNotification('Video deleted successfully!');
        } catch (error) {
            console.error('Error deleting video:', error);
            showNotification('Failed to delete video. Please try again.', 'error');
        }
    };

    // Extract YouTube ID from URL
    const extractYouTubeId = (url) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/;
        const match = url.match(regex);
        return match ? match[1] : url;
    };

    // Navigation component
    const Navigation = () => (
        <nav className="fixed top-0 w-full bg-black z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
            <span className="text-white text-xl font-medium tracking-tight">
              RYANSH
            </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => setCurrentSection('home')} className={`text-sm font-medium transition-colors ${currentSection === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            Home
                        </button>
                        <button onClick={() => setCurrentSection('comics')} className={`text-sm font-medium transition-colors ${currentSection === 'comics' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            Comics
                        </button>
                        <button onClick={() => setCurrentSection('videos')} className={`text-sm font-medium transition-colors ${currentSection === 'videos' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            Videos
                        </button>
                        <button onClick={() => setCurrentSection('about')} className={`text-sm font-medium transition-colors ${currentSection === 'about' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                            About
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAdmin ? (
                            <button onClick={handleLogout} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                                Logout
                            </button>
                        ) : (
                            <button onClick={() => setShowLogin(true)} className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                                Admin
                            </button>
                        )}

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-800">
                        <button onClick={() => { setCurrentSection('home'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors">
                            Home
                        </button>
                        <button onClick={() => { setCurrentSection('comics'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors">
                            Comics
                        </button>
                        <button onClick={() => { setCurrentSection('videos'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors">
                            Videos
                        </button>
                        <button onClick={() => { setCurrentSection('about'); setMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 text-white hover:bg-gray-900 transition-colors">
                            About
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );

    // Home section
    const HomeSection = () => (
        <div className="min-h-screen bg-black text-white">
            <div className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                Create.<br />Imagine.<br /><span className="text-gray-400">Share.</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                                Hi, I'm Ryansh from Sydney. I create comics, make videos, and share my creative journey.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setCurrentSection('comics')} className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-gray-200 transition-all transform hover:scale-105 inline-flex items-center text-sm md:text-base">
                                    Explore Comics
                                    <ArrowRight className="ml-2" size={20} />
                                </button>
                                <button onClick={() => setCurrentSection('videos')} className="bg-transparent text-white border border-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium hover:bg-white hover:text-black transition-all transform hover:scale-105 text-sm md:text-base">
                                    Watch Videos
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-gray-800 to-black rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-900 rounded-xl p-6 text-center">
                                        <Palette size={32} className="mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Artist</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-xl p-6 text-center">
                                        <Film size={32} className="mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Creator</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-xl p-6 text-center">
                                        <Grid size={32} className="mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Comics</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-xl p-6 text-center">
                                        <Play size={32} className="mx-auto mb-2" />
                                        <p className="text-sm text-gray-400">Videos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white text-black py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">{comics.length}</div>
                            <div className="text-gray-600">Comics Created</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">{videos.length}</div>
                            <div className="text-gray-600">Videos Shared</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">∞</div>
                            <div className="text-gray-600">Creativity</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">2024</div>
                            <div className="text-gray-600">Started</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Comics section
    const ComicsSection = () => (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Comics</h1>
                    <p className="text-gray-600 text-lg">My collection of original comic strips and artwork</p>
                </div>

                {isAdmin && (
                    <div className="mb-8">
                        <button onClick={addComic} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center">
                            <Plus size={20} className="mr-2" />
                            Add New Comic
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comics.map(comic => {
                        const comicData = tempComicData[comic.id] || comic;
                        return (
                            <div key={comic.id} className="group relative overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300" onMouseEnter={() => setHoveredCard(comic.id)} onMouseLeave={() => setHoveredCard(null)}>
                                {editingComic === comic.id ? (
                                    <div className="bg-gray-50 p-6">
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={comicData.title}
                                                onChange={(e) => updateComic(comic.id, 'title', e.target.value)}
                                                placeholder="Comic title"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-4"
                                            />
                                            <input
                                                type="text"
                                                value={comicData.date}
                                                onChange={(e) => updateComic(comic.id, 'date', e.target.value)}
                                                placeholder="Date (e.g., September 2024)"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-4"
                                            />
                                            <ImageUploader
                                                onImageUpload={(url) => updateComic(comic.id, 'image_url', url)}
                                                currentImage={comicData.image_url}
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => saveComic(comicData)} className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                                Save
                                            </button>
                                            <button onClick={() => { setEditingComic(null); if (comic.is_temp) deleteComic(comic.id); }} className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {comicData.image_url ? (
                                            <div className="cursor-pointer" onClick={() => setViewingComic(comicData)}>
                                                <img src={comicData.image_url} alt={comicData.title} className="w-full h-64 object-cover" />
                                                {hoveredCard === comic.id && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white font-medium">View Full Size</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-64 bg-gray-100 flex items-center justify-center">
                                                <ImageIcon size={48} className="text-gray-400" />
                                                <p className="text-gray-500 ml-2">No image added yet</p>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{comicData.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{comicData.date}</p>
                                            {isAdmin && (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => setEditingComic(comic.id)} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                                        <Edit2 size={16} className="inline mr-1" />
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deleteComic(comic.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                                                        <Trash2 size={16} className="inline mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // Videos section
    const VideosSection = () => (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Videos</h1>
                    <p className="text-gray-600 text-lg">My creative process, performances, and video content</p>
                </div>

                {isAdmin && (
                    <div className="mb-8">
                        <button onClick={addVideo} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors inline-flex items-center">
                            <Plus size={20} className="mr-2" />
                            Add New Video
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map(video => {
                        const videoData = tempVideoData[video.id] || video;
                        return (
                            <div key={video.id} className="group relative overflow-hidden rounded-2xl hover:shadow-2xl transition-all duration-300">
                                {editingVideo === video.id ? (
                                    <div className="bg-gray-50 p-6">
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                value={videoData.title}
                                                onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                                                placeholder="Video title"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-4"
                                            />
                                            <input
                                                type="text"
                                                value={videoData.date}
                                                onChange={(e) => updateVideo(video.id, 'date', e.target.value)}
                                                placeholder="Date (e.g., September 2024)"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black mb-4"
                                            />
                                            <input
                                                type="text"
                                                value={videoData.youtube_id}
                                                onChange={(e) => updateVideo(video.id, 'youtube_id', extractYouTubeId(e.target.value))}
                                                placeholder="YouTube URL or ID"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                            />
                                            <p className="text-xs text-gray-500 mt-2">
                                                Paste a YouTube URL (e.g., https://youtube.com/watch?v=dQw4w9WgXcQ) or just the video ID
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => saveVideo(videoData)} className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">
                                                Save
                                            </button>
                                            <button onClick={() => { setEditingVideo(null); if (video.is_temp) deleteVideo(video.id); }} className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {videoData.youtube_id ? (
                                            <div className="relative pb-[56.25%] bg-black">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${videoData.youtube_id}`}
                                                    className="absolute top-0 left-0 w-full h-full"
                                                    title={videoData.title}
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-64 bg-gray-100 flex items-center justify-center">
                                                <Play size={48} className="text-gray-400" />
                                                <p className="text-gray-500 ml-2">No video added yet</p>
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2">{videoData.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{videoData.date}</p>
                                            {isAdmin && (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => setEditingVideo(video.id)} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
                                                        <Edit2 size={16} className="inline mr-1" />
                                                        Edit
                                                    </button>
                                                    <button onClick={() => deleteVideo(video.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                                                        <Trash2 size={16} className="inline mr-1" />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // About section
    const AboutSection = () => (
        <div className="min-h-screen bg-black text-white pt-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-center min-h-[60vh]">
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-8">
                            About<br /><span className="text-gray-400">Ryansh</span>
                        </h1>
                        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                            <p>
                                I'm Ryansh Sharma, a young creative from Sydney, Australia.
                                My passion lies in storytelling through comics and sharing my journey through videos.
                            </p>
                            <p>
                                Every comic I create is a new adventure, exploring different worlds and characters.
                                Through my videos, I share my creative process and performances.
                            </p>
                            <p>
                                Living in Sydney inspires my work every day - from the iconic harbor to the vibrant culture,
                                there's always something new to capture in my art.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors">
                            <div className="text-3xl mb-3">🎨</div>
                            <div className="font-medium">Artist</div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors">
                            <div className="text-3xl mb-3">📚</div>
                            <div className="font-medium">Storyteller</div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors">
                            <div className="text-3xl mb-3">🎬</div>
                            <div className="font-medium">Creator</div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors">
                            <div className="text-3xl mb-3">🇦🇺</div>
                            <div className="font-medium">Sydney</div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-800 mt-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">© 2024 Ryansh Sharma. All rights reserved.</p>
                        <p className="text-gray-400 text-sm">Sydney, Australia</p>
                    </div>
                </div>
            </footer>
        </div>
    );

    // Login modal component
    const LoginModal = React.useMemo(() => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Admin Access</h2>
                <div className="space-y-4">
                    <div>
                        <input
                            key="email-input"
                            type="email"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            placeholder="Admin Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <input
                            key="password-input"
                            type="password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={handleLogin} className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                            Sign In
                        </button>
                        <button onClick={() => { setShowLogin(false); setLoginUsername(''); setLoginPassword(''); }} className="flex-1 bg-gray-200 text-black py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ), [loginUsername, loginPassword, handleLogin]);

    // Notification component
    const NotificationComponent = () => {
        if (!notification) return null;

        return (
            <div className={`fixed top-20 right-4 left-4 md:left-auto md:right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
                notification.type === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-green-500 text-white'
            }`}>
                <div className="flex items-center space-x-2">
                    <span>{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="text-white hover:text-gray-200"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    };

    // Image viewer modal
    const ImageModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4" onClick={() => setViewingComic(null)}>
            <div className="relative max-w-7xl max-h-[90vh]">
                <img src={viewingComic.image_url} alt={viewingComic.title} className="max-w-full max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
                <button onClick={() => setViewingComic(null)} className="absolute top-4 right-4 bg-white text-black rounded-full p-3 hover:bg-gray-200 transition-colors">
                    <X size={20} />
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation />
            {currentSection === 'home' && <HomeSection />}
            {currentSection === 'comics' && <ComicsSection />}
            {currentSection === 'videos' && <VideosSection />}
            {currentSection === 'about' && <AboutSection />}
            {showLogin && LoginModal}
            {viewingComic && <ImageModal />}
            <NotificationComponent />
        </div>
    );
}