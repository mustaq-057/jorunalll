import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Type, Sparkles, Check, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  FONT_OPTIONS, 
  PAPER_OPTIONS, 
  getGlobalFont, 
  setGlobalFont, 
  getGlobalPaper, 
  setGlobalPaper, 
  getGlobalFontSize, 
  setGlobalFontSize,
  PaperStyle 
} from '../lib/fonts';

export function Settings() {
  const [selectedFont, setSelectedFont] = useState(getGlobalFont());
  const [selectedPaper, setSelectedPaper] = useState<PaperStyle>(getGlobalPaper());
  const [selectedFontSize, setSelectedFontSize] = useState(getGlobalFontSize());
  const [fontSavedAlert, setFontSavedAlert] = useState(false);

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('');

  const handleFontSelect = (fontId: string) => {
    setSelectedFont(fontId);
    setGlobalFont(fontId);
    setFontSavedAlert(true);
    setTimeout(() => setFontSavedAlert(false), 2500);
  };

  const handlePaperSelect = (paper: PaperStyle) => {
    setSelectedPaper(paper);
    setGlobalPaper(paper);
    setFontSavedAlert(true);
    setTimeout(() => setFontSavedAlert(false), 2500);
  };

  const handleFontSizeSelect = (size: string) => {
    setSelectedFontSize(size);
    setGlobalFontSize(size);
    setFontSavedAlert(true);
    setTimeout(() => setFontSavedAlert(false), 2500);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    const actualPin = localStorage.getItem('kitty_pin') || '1101';
    
    if (currentPin !== actualPin) {
      setMessage('Current PIN is incorrect 🌸');
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setMessage('New PIN must be exactly 4 digits 🌸');
      return;
    }
    if (newPin !== confirmPin) {
      setMessage('New PINs do not match 🌸');
      return;
    }

    localStorage.setItem('kitty_pin', newPin);
    setMessage('PIN updated successfully! 🎀');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  const activeFontObj = FONT_OPTIONS.find(f => f.id === selectedFont) || FONT_OPTIONS[0];

  return (
    <div className="space-y-10 pb-24 max-w-4xl mx-auto">
      <header className="bg-white p-8 rounded-[3rem] border border-border shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary">
            <SettingsIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-heading text-4xl text-primary drop-shadow-sm mb-1">Journal Settings</h2>
            <p className="text-muted-foreground font-secondary text-lg font-medium">customize your handwriting, paper & security</p>
          </div>
        </div>
      </header>

      {/* Diary Font & Aesthetics Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white p-6 md:p-10 rounded-[3rem] border border-border shadow-sm space-y-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground">Diary Handwriting Style</h3>
              <p className="text-muted-foreground text-sm font-secondary">Choose the handwriting that fits your soul</p>
            </div>
          </div>
          {fontSavedAlert && (
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Updated!
            </motion.span>
          )}
        </div>

        {/* Live Font Sample Preview */}
        <div className="p-6 rounded-[2rem] bg-secondary/15 border border-primary/20 relative overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Diary Preview — {activeFontObj.name}</span>
          </div>
          <div className={`p-4 rounded-xl bg-white/80 shadow-inner ${selectedPaper === 'lined' ? 'paper-lined' : selectedPaper === 'grid' ? 'paper-grid' : 'paper-blank'}`}>
            <p className={`text-2xl md:text-3xl text-foreground leading-relaxed ${activeFontObj.className}`}>
              "Dearest memory, every little moment spent with you is preserved here forever in my heart ♡"
            </p>
            <p className={`text-lg text-primary/80 mt-3 text-right ${activeFontObj.className}`}>
              — {activeFontObj.description}
            </p>
          </div>
        </div>

        {/* Font Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FONT_OPTIONS.map((f) => {
            const isSelected = selectedFont === f.id;
            return (
              <button
                type="button"
                key={f.id}
                onClick={() => handleFontSelect(f.id)}
                className={`p-5 rounded-[2rem] border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 relative group ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md scale-[1.01]'
                    : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground flex items-center gap-2">
                    {f.name}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected ? 'bg-primary text-white scale-110 shadow-sm' : 'border border-border text-transparent group-hover:border-primary/50'
                  }`}>
                    ✓
                  </div>
                </div>

                <p className={`text-xl text-foreground/90 leading-tight line-clamp-1 ${f.className}`}>
                  {f.sample}
                </p>

                <span className="text-[11px] text-muted-foreground font-medium">
                  {f.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notebook Paper Style & Font Size Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/60">
          {/* Paper Texture */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Notebook Page Texture
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAPER_OPTIONS.map((p) => {
                const isSelected = selectedPaper === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePaperSelect(p.id)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-card hover:bg-secondary/20 text-muted-foreground'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading Font Size */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-primary" /> Reading Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'small', label: 'Petite' },
                { id: 'medium', label: 'Cozy' },
                { id: 'large', label: 'Large' },
              ].map((s) => {
                const isSelected = selectedFontSize === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleFontSizeSelect(s.id)}
                    className={`py-3 px-2 rounded-2xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-card hover:bg-secondary/20 text-muted-foreground'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lock PIN Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, delay: 0.1 }}
        className="max-w-xl mx-auto bg-white p-8 rounded-[3rem] border border-border shadow-sm"
      >
        <h3 className="font-heading text-2xl text-foreground mb-6">Change Lock PIN</h3>
        
        <form onSubmit={handleSavePin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">Current PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={currentPin}
              onChange={e => setCurrentPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Enter current 4-digit PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">New PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={newPin}
              onChange={e => setNewPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Enter new 4-digit PIN"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-muted-foreground mb-1 ml-4">Confirm New PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={confirmPin}
              onChange={e => setConfirmPin(e.target.value)}
              className="w-full bg-secondary/20 border-none rounded-full px-6 py-3 font-secondary text-lg text-foreground focus:ring-2 focus:ring-primary/30"
              placeholder="Confirm new 4-digit PIN"
            />
          </div>

          {message && (
            <p className={`text-center font-bold text-sm ${message.includes('successfully') ? 'text-green-500' : 'text-primary'}`}>
              {message}
            </p>
          )}

          <button 
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-primary to-[#e85d95] text-white rounded-full py-4 font-bold font-secondary text-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
}
