// store/useAppStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. Importa el middleware 'persist'

// 2. Envuelve tu función con persist()
const useAppStore = create(
    persist(
        (set) => ({
            logged: {user_email: null, kit_code: null, user_name: null},
            setLogged: (log_info) => set({logged: log_info}),



            openLoginForm: false,
            setOpenLoginForm: (open) => set({openLoginForm: open}),



            materialCourseChat: [],
            setMaterialCourseChat: (chat) => set({materialCourseChat: chat}),



            openCourseId: null,
            setOpenCourseId: (id) => set({openCourseId: id}),



            courses: [],
            setCourses: (courses) => set({courses: courses}),

            
            actividades: [],
            setActividades: (actividades) => set({actividades: actividades}),

            videos: [],
            setVideos: (videos) => set({videos: videos}),

            documents: [],
            setDocuments: (documents) => set({documents: documents}),

            issues: [],
            setIssues: (issues) => set({issues: issues}),

        }),
        {
            partialize: (state) => ({
                logged: {
                    user_email: state.logged?.user_email ?? null,
                    user_name: state.logged?.user_name ?? null,
                }
            }),
        }
    )
);

export default useAppStore;