import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <>
      <header>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container">
            <span className="navbar-brand">
              Everyone Needs To Smile
            </span>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-top mt-5 py-4">
        <div className="container text-center">
          <p className="mb-0">
            Everyone Needs To Smile
          </p>
        </div>
      </footer>
    </>
  )
}

export default MainLayout