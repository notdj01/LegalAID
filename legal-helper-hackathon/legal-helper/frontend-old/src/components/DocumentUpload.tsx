import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { summarizeDocument } from '@/lib/api';
import { SummarizationResponse } from '@/types';
import { Upload, FileText, Loader2, FileCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DocumentUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState<SummarizationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSummary(null);
            setError('');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setSummary(null);
                setError('');
            } else {
                setError("Only PDF files are supported.");
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            const data = await summarizeDocument(file);
            setSummary(data);
        } catch (err) {
            setError('Failed to summarize document. Ensure it is a valid PDF.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in-up">
            <Card className="glass-panel border-none shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-serif text-blue-900">Document Analysis</CardTitle>
                    <CardDescription>Upload legal notices, court orders, or judgments (PDF only)</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Drag and Drop Area */}
                    <div
                        className={cn(
                            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center flex flex-col items-center justify-center gap-4 min-h-[200px] cursor-pointer",
                            dragActive ? "border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-slate-300 hover:border-blue-400 hover:bg-slate-50",
                            file ? "bg-blue-50/30 border-blue-200" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-upload')?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {file ? (
                            <>
                                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                                    <FileCheck className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700">{file.name}</p>
                                    <p className="text-sm text-slate-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                                    disabled={loading}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                                >
                                    {loading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Processing...</> : "Summarize PDF"}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
                                    <Upload className="h-8 w-8" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-600">Drag & Drop your PDF here</p>
                                    <p className="text-sm text-slate-400 mt-1">or click to browse</p>
                                </div>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center gap-2 justify-center">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {summary && (
                <Card className="bg-white shadow-xl border-slate-100 overflow-hidden animate-in-up">
                    <div className="h-2 bg-amber-500 w-full" />
                    <CardHeader className="bg-slate-50/50 pb-4">
                        <CardTitle className="flex items-center gap-2 font-serif text-slate-800">
                            <Sparkles size={20} className="text-amber-500" /> AI Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                                {summary.summary}
                            </p>
                        </div>

                        {summary.key_points && summary.key_points.length > 0 && (
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                    Key Highlights
                                </h3>
                                <ul className="space-y-3">
                                    {summary.key_points.map((point, idx) => (
                                        <li key={idx} className="flex gap-3 text-slate-700 group">
                                            <span className="font-bold text-blue-200 group-hover:text-blue-400 transition-colors select-none">{idx + 1}.</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

// Dummy Sparkles import fix if not in lucide (it is, but just in case of version mismatch, using Star as fallback visually if needed, but Sparkles is standard)
import { Sparkles } from 'lucide-react';

export default DocumentUpload;
