import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import Login from "./pages/Login"
import Admin from "./pages/Admin"

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // session initiale
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // écouter les changements de connexion
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Chargement…</div>
  }

  // PAS connecté → page login
  if (!session) {
    return <Login />
  }

  // Connecté → admin / app
  return <Admin />
}
