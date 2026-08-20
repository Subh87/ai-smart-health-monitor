import React, { useState } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import { apiClient } from '../services/apiClient';
import { AIAnalysisResult } from '../types';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Brain, Sparkles, AlertCircle, CheckCircle2, HelpCircle, Shield, ArrowRight } from 'lucide-react';

export const AIAnalysisPage: React.FC = () => {
  const { latestReading } = useHealthData();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasData = Boolean(latestReading);
  const heartRate = latestReading ? latestReading.heartRate : 75;
  const spo2 = latestReading ? latestReading.spo2 : 98;
  const temperature = latestReading ? latestReading.temperature : 36.6;

  const handleGenerateAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasData) return;
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.analyzeReadings({
        heartRate,
        spo2,
        temperature,
        symptoms: symptoms.trim() || undefined
      });
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error || 'AI analysis request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">AI Reading Analysis Generator</h1>
        <p className="text-xs text-slate-400">Powered by Google Gemini API - Educational Non-Diagnostic Insights</p>
      </div>

      <DisclaimerBanner />

      {/* Input Setup Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Brain className="w-5 h-5 text-teal-400" />
          <span>Telemetry Context for AI Evaluation</span>
        </h2>

        <div className="grid grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center text-xs">
          <div>
            <span className="text-slate-400 block">Heart Rate</span>
            <span className="text-lg font-extrabold text-rose-400 font-outfit">
              {latestReading ? `${heartRate} BPM` : '--'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">SpO2</span>
            <span className="text-lg font-extrabold text-teal-400 font-outfit">
              {latestReading ? `${spo2}%` : '--'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Temperature</span>
            <span className="text-lg font-extrabold text-amber-400 font-outfit">
              {latestReading ? `${temperature}°C` : '--'}
            </span>
          </div>
        </div>

        <form onSubmit={handleGenerateAnalysis} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Optional User-Reported Symptoms or Context
            </label>
            <textarea
              rows={2}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Feeling warm after exercising, slight headache..."
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{loading ? 'Consulting Gemini AI...' : 'Generate AI Health Analysis'}</span>
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Analysis Output Section */}
      {result && (
        <div className="space-y-5 animate-fadeIn">
          {/* Summary Box */}
          <div className="glass-card p-6 rounded-2xl border border-teal-500/30 space-y-3 glow-teal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-outfit">Analysis Summary</h3>
              </div>
              {result.overallStatus && (
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md border ${
                  result.overallStatus === 'NORMAL' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  result.overallStatus === 'URGENT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  Status: {result.overallStatus}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">{result.summary}</p>
          </div>

          {/* Explanations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Brain className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Non-Diagnostic Explanations</h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {(result.explanations || result.observations || []).map((exp, idx) => (
                  <li key={idx} className="leading-relaxed">{exp}</li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-4 h-4" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safety & Measurement Guidance</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {result.safetyGuidance || 'Re-check readings after 5 minutes of quiet rest if values show unexpected fluctuations.'}
              </p>
              {(result.recheckRecommended || result.overallStatus === 'ATTENTION' || result.overallStatus === 'URGENT') && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Recommendation: Re-check reading after 5 minutes of rest.</span>
                </div>
              )}
            </div>
          </div>

          {/* Questions / Recommendations for Doctor */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <HelpCircle className="w-4 h-4" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Suggested Questions & Recommendations</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {(result.questionsForDoctor || result.recommendations || []).map((q, i) => (
                <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
