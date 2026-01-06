import streamlit as st
import streamlit_antd_components as sac
from src.shared.styles import apply_scribed_theme
from src.reception.view import render_reception
from src.draft.view import render_draft
from src.workflow.view import render_workflow
from src.documents.view import render_documents
from src.analytics.view import render_analytics

# 1. Page Configuration
st.set_page_config(page_title="Sync | Legal Intelligence", layout="wide")

# 2. Apply the "Scribed" Visual Language (CSS)
apply_scribed_theme()

# 3. Sidebar Navigation (The Router)
with st.sidebar:
    st.markdown('<h1 style="color: white; margin-bottom: 20px;">Sync</h1>', unsafe_allow_html=True)
    
    selected = sac.menu(
        items=[
            sac.MenuItem('Reception', icon='chat-left-text'),
            sac.MenuItem('Draft', icon='pencil-square'),
            sac.MenuItem('Workflow', icon='diagram-3'),
            sac.MenuItem('Documents', icon='file-earmark-lock2'),
            sac.MenuItem('Analytics', icon='bar-chart-line'),
        ],
        index=0,
        size='lg',
        color='#BD3900', # Our Hero Orange
        variant='filled'
    )
    
    st.sidebar.markdown("---")
    st.sidebar.caption("v2.0.0 | Enterprise Edition")

# 4. Vertical Slice Routing Logic
if selected == 'Reception':
    render_reception()
elif selected == 'Draft':
    render_draft()
elif selected == 'Workflow':
    render_workflow()
elif selected == 'Documents':
    render_documents()
elif selected == 'Analytics':
    render_analytics()