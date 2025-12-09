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



            openMaterialCourse: {course_name: null, open: false, pdf_url: null, video_url: null},
            setOpenMaterialCourse: (open) => set({openMaterialCourse: open}),
            


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

            
            openMaterialsPage: false,
            setOpenMaterialsPage: (open) => set({openMaterialsPage: open})

        }),
       {
          
            partialize: (state) => ({ 
                logged: state.logged 
            }),
        }
    )
);

export default useAppStore;