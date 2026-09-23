import { collectionConfigs } from './collection-configs'
import { CollectionEditor, EditorShell } from './CollectionEditor'
import { ProfileEditorShell } from './ProfileEditor'
import { ProjectsEditorShell } from './ProjectsEditor'
import { SiteEditorShell } from './SiteEditor'

export const ProfilePage = ProfileEditorShell
export const ProjectsPage = ProjectsEditorShell
export const SitePage = SiteEditorShell

export function collectionPage(key: keyof typeof collectionConfigs) {
  const config = collectionConfigs[key]
  return function CollectionPage() {
    return (
      <EditorShell eyebrow="Content" title={config.title} description={config.description}>
        <CollectionEditor config={config} />
      </EditorShell>
    )
  }
}