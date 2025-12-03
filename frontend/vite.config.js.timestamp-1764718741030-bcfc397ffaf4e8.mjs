// vite.config.js
import { defineConfig } from "file:///C:/Users/K/OneDrive/Documentos/PROJETOS%20ANTIGRAVITY/rpa-calculator/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/K/OneDrive/Documentos/PROJETOS%20ANTIGRAVITY/rpa-calculator/frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///C:/Users/K/OneDrive/Documentos/PROJETOS%20ANTIGRAVITY/rpa-calculator/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["logo.png"],
      // Inclui o logo nos assets cacheados
      manifest: {
        name: "RPA ROI Navigator",
        short_name: "ROI Navigator",
        description: "Calculadora de ROI para Automa\xE7\xF5es RPA",
        theme_color: "#1a237e",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "logo.png",
            // Aponta para o arquivo na pasta public
            sizes: "192x192",
            // O navegador tentará redimensionar
            type: "image/png"
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxLXFxcXE9uZURyaXZlXFxcXERvY3VtZW50b3NcXFxcUFJPSkVUT1MgQU5USUdSQVZJVFlcXFxccnBhLWNhbGN1bGF0b3JcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEtcXFxcT25lRHJpdmVcXFxcRG9jdW1lbnRvc1xcXFxQUk9KRVRPUyBBTlRJR1JBVklUWVxcXFxycGEtY2FsY3VsYXRvclxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSy9PbmVEcml2ZS9Eb2N1bWVudG9zL1BST0pFVE9TJTIwQU5USUdSQVZJVFkvcnBhLWNhbGN1bGF0b3IvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjsvLyBmcm9udGVuZC92aXRlLmNvbmZpZy5qc1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgICAgVml0ZVBXQSh7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxyXG4gICAgICAgICAgICBpbmNsdWRlQXNzZXRzOiBbJ2xvZ28ucG5nJ10sIC8vIEluY2x1aSBvIGxvZ28gbm9zIGFzc2V0cyBjYWNoZWFkb3NcclxuICAgICAgICAgICAgbWFuaWZlc3Q6IHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdSUEEgUk9JIE5hdmlnYXRvcicsXHJcbiAgICAgICAgICAgICAgICBzaG9ydF9uYW1lOiAnUk9JIE5hdmlnYXRvcicsXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogJ0NhbGN1bGFkb3JhIGRlIFJPSSBwYXJhIEF1dG9tYVx1MDBFN1x1MDBGNWVzIFJQQScsXHJcbiAgICAgICAgICAgICAgICB0aGVtZV9jb2xvcjogJyMxYTIzN2UnLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxyXG4gICAgICAgICAgICAgICAgaWNvbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogJ2xvZ28ucG5nJywgLy8gQXBvbnRhIHBhcmEgbyBhcnF1aXZvIG5hIHBhc3RhIHB1YmxpY1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzE5MngxOTInLCAvLyBPIG5hdmVnYWRvciB0ZW50YXJcdTAwRTEgcmVkaW1lbnNpb25hclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnbG9nby5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjOiAnbG9nby5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHVycG9zZTogJ2FueSBtYXNrYWJsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgIF0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICBwb3J0OiA1MTczLFxyXG4gICAgICAgIG9wZW46IHRydWUsXHJcbiAgICB9LFxyXG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsVUFBVTtBQUFBO0FBQUEsTUFDMUIsVUFBVTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFBYTtBQUFBLFFBQ2IsYUFBYTtBQUFBLFFBQ2Isa0JBQWtCO0FBQUEsUUFDbEIsU0FBUztBQUFBLFFBQ1QsT0FBTztBQUFBLFVBQ0g7QUFBQSxZQUNJLEtBQUs7QUFBQTtBQUFBLFlBQ0wsT0FBTztBQUFBO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNJLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0ksS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFlBQ04sU0FBUztBQUFBLFVBQ2I7QUFBQSxRQUNKO0FBQUEsTUFDSjtBQUFBLElBQ0osQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNWO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
