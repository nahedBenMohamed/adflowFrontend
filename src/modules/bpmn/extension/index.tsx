import { executableFix } from './ExecutableFix';
import { WorkspaceContextPadProvider } from './WorkspaceContextPadProvider';
import { WorkspacePalette } from './WorkspacePalette';
import { WorkspaceRenderer } from './WorkspaceRenderer';

const WorkspaceModule = {
  __init__: ['customPalette', 'customRenderer', 'customContextPadProvider', executableFix],
  customPalette: ['type', WorkspacePalette],
  customRenderer: ['type', WorkspaceRenderer],
  customContextPadProvider: ['type', WorkspaceContextPadProvider],
};

export default WorkspaceModule;
