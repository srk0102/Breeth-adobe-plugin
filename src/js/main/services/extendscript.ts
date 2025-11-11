/**
 * ExtendScript Execution Service
 * Handles execution of ExtendScript commands in Premiere Pro
 */

import { evalES } from '../../lib/utils/bolt';

export interface ExecutionResult {
    success: boolean;
    result?: any;
    error?: string;
}

class ExtendScriptService {
    /**
     * Execute a single ExtendScript command
     */
    async executeCommand(command: string): Promise<ExecutionResult> {
        try {
            console.log('Executing ExtendScript:', command);
            
            const result = await evalES(command);
            
            return {
                success: true,
                result: result
            };
        } catch (error) {
            console.error('ExtendScript execution error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
    
    /**
     * Execute multiple ExtendScript commands in sequence
     */
    async executeCommands(commands: string[]): Promise<ExecutionResult[]> {
        const results: ExecutionResult[] = [];
        
        for (const command of commands) {
            const result = await this.executeCommand(command);
            results.push(result);
            
            // Stop execution if a command fails
            if (!result.success) {
                console.error('Command failed, stopping execution:', command);
                break;
            }
        }
        
        return results;
    }
    
    /**
     * Get current project context (active sequence, selected clips, etc.)
     */
    async getProjectContext(): Promise<Record<string, any>> {
        try {
            const contextScript = `
                (function() {
                    var context = {};
                    
                    // Project info
                    if (app.project) {
                        context.projectName = app.project.name;
                        context.projectPath = app.project.path;
                        
                        // Active sequence
                        if (app.project.activeSequence) {
                            var seq = app.project.activeSequence;
                            context.activeSequence = {
                                name: seq.name,
                                framerate: seq.framerate,
                                videoTracks: seq.videoTracks.numTracks,
                                audioTracks: seq.audioTracks.numTracks
                            };
                            
                            // Selected clips
                            var selectedClips = [];
                            for (var i = 0; i < seq.videoTracks.numTracks; i++) {
                                var track = seq.videoTracks[i];
                                for (var j = 0; j < track.clips.numItems; j++) {
                                    var clip = track.clips[j];
                                    if (clip.isSelected()) {
                                        selectedClips.push({
                                            name: clip.name,
                                            trackIndex: i,
                                            start: clip.start.seconds,
                                            end: clip.end.seconds
                                        });
                                    }
                                }
                            }
                            context.selectedClips = selectedClips;
                        }
                    }
                    
                    return JSON.stringify(context);
                })();
            `;
            
            const result = await this.executeCommand(contextScript);
            
            if (result.success && result.result) {
                try {
                    return JSON.parse(result.result);
                } catch (e) {
                    console.error('Failed to parse context:', e);
                    return {};
                }
            }
            
            return {};
        } catch (error) {
            console.error('Error getting project context:', error);
            return {};
        }
    }
}

export const extendscriptService = new ExtendScriptService();



