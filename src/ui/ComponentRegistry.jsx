import React, { useEffect } from 'react';
import { Hero } from './components/Hero.jsx';
import { Grid } from './components/Grid.jsx';
import { DataCard } from './components/DataCard.jsx';
import { Navbar } from './components/Navbar.jsx';
import { MateriaForge } from './components/MateriaForge.jsx';
import { MateriaDetail } from './components/MateriaDetail.jsx';
import { BannerInfo } from './components/BannerInfo.jsx';
import { BannerAction } from './components/BannerAction.jsx';
import { useIndraResonance } from '../score/hooks/useIndraResonance.js';
import { useSovereign } from '../score/SovereignContext.jsx';

/**
 * 📝 MARKDOWN ACTOR
 */
const MarkdownBody = ({ definition, params }) => {
    const componentId = definition?.meta?.component_id;
    const { dispatch } = useSovereign();
    const { remoteData } = useIndraResonance(params?.slug);

    useEffect(() => {
        if (remoteData && remoteData.metadata?.body_markdown) {
            dispatch('inventory_update_component', {
                id: componentId,
                data: { content: { body: remoteData.metadata.body_markdown } }
            });
        }
    }, [remoteData]);

    return (
        <section className="markdown-content">
            <div dangerouslySetInnerHTML={{ __html: definition.data?.content?.body || "Resonando materia..." }} />
        </section>
    );
};

import { MateriaReader } from './components/MateriaReader.jsx';
import { IdentityProfile } from './components/IdentityProfile.jsx';
import { ComercialFilbo } from './components/ComercialFilbo.jsx';
import { ComercialAuditoria } from './components/ComercialAuditoria.jsx';

export const COMPONENT_REGISTRY = {
    'hero_portal_home': Hero,
    'grid_entries_newsfeed': Grid,
    'hero_detail': Hero,
    'markdown_body': MarkdownBody,
    'data_card': DataCard,
    'main_navbar': Navbar,
    'hero_forge': Hero,
    'materia_forge': MateriaForge,
    'materia_detail': MateriaDetail,
    'banner_info': BannerInfo,
    'banner_action': BannerAction,
    'materia_reader': MateriaReader,
    'identity_profile': IdentityProfile,
    'comercial_portal': ComercialFilbo,
    'comercial_auditoria': ComercialAuditoria
};


