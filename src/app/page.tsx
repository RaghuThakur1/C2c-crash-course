"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CLUBS, isClubName } from "@/lib/clubs";
import { supabase, type Registration } from "@/lib/supabase";

export default function Home() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(true);
  const [rosterError, setRosterError] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [clubName, setClubName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterClub, setFilterClub] = useState("All clubs");
  const [search, setSearch] = useState("");

  const loadRoster = useCallback(async () => {
    if (!supabase) {
      setRosterError(
        "Connect a Supabase project to load and share club registrations.",
      );
      setLoadingRoster(false);
      return;
    }

    setLoadingRoster(true);
    setRosterError("");
    const { data, error } = await supabase
      .from("club_signups")
      .select("id, full_name, student_id, club_name, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setRosterError(`Could not load the roster: ${error.message}`);
      setRegistrations([]);
    } else {
      setRegistrations(data);
    }
    setLoadingRoster(false);
  }, []);

  useEffect(() => {
    void loadRoster();
  }, [loadRoster]);

  const visibleRegistrations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return registrations.filter((registration) => {
      const matchesClub =
        filterClub === "All clubs" || registration.club_name === filterClub;
      const matchesSearch =
        !normalizedSearch ||
        registration.full_name.toLowerCase().includes(normalizedSearch) ||
        registration.student_id.toLowerCase().includes(normalizedSearch);
      return matchesClub && matchesSearch;
    });
  }, [filterClub, registrations, search]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const normalizedName = name.trim();
    const normalizedStudentId = studentId.trim();
    if (!normalizedName || !normalizedStudentId || !isClubName(clubName)) {
      setFormError("Enter your name and student ID, then choose a club.");
      return;
    }
    if (!supabase) {
      setFormError(
        "Sign-ups are not connected yet. Ask the site owner to finish the Supabase setup.",
      );
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("club_signups").insert({
      full_name: normalizedName,
      student_id: normalizedStudentId,
      club_name: clubName,
    });

    if (error) {
      setFormError(
        error.code === "23505"
          ? "You’re already signed up for this club."
          : `Your sign-up could not be saved: ${error.message}`,
      );
      setSubmitting(false);
      return;
    }

    setName("");
    setStudentId("");
    setClubName("");
    setSuccessMessage(`You’re on the list for ${clubName}!`);
    await loadRoster();
    setSubmitting(false);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Clubhouse home">
          <span className="brand-mark" aria-hidden="true">
            c
          </span>
          clubhouse
        </a>
        <a className="topbar-link" href="#roster">
          Explore the roster <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> YOUR NEXT THING STARTS HERE</p>
          <h1>
            Find your
            <br />
            <span>people.</span>
          </h1>
          <p className="hero-description">
            Try something new, meet your kind of people, and make this school
            year yours. There’s a club for that.
          </p>
          <a className="button button-dark" href="#signup">
            Find your club <span aria-hidden="true">↓</span>
          </a>
          <div className="hero-note">
            <span className="avatar-stack" aria-hidden="true">
              <i>✳</i><i>☺</i><i>✦</i>
            </span>
            <span>Good things happen when you show up.</span>
          </div>
        </div>
        <div className="hero-art" aria-label="Illustration of a welcoming club community">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="sunburst" aria-hidden="true">✳</div>
          <div className="art-caption">MAKE ROOM<br />FOR SOMETHING<br />NEW.</div>
          <div className="art-sticker">JOIN<br />THE<br />CLUB!</div>
          <div className="art-spark spark-one">✦</div>
          <div className="art-spark spark-two">✧</div>
          <div className="art-dot dot-one" />
          <div className="art-dot dot-two" />
        </div>
      </section>

      <section className="club-section section-wrap" aria-labelledby="club-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE BIT OF EVERYTHING</p>
            <h2 id="club-heading">Pick a thing. Make it yours.</h2>
          </div>
          <p className="section-aside">Six ways to find your corner of campus.</p>
        </div>
        <div className="club-grid">
          {CLUBS.map((club, index) => (
            <button
              className={`club-card club-card-${index + 1}`}
              key={club.name}
              onClick={() => {
                setClubName(club.name);
                document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
              }}
              type="button"
            >
              <span className="club-card-top">
                <span className="club-category">{club.category}</span>
                <span className="club-arrow" aria-hidden="true">↗</span>
              </span>
              <span className="club-name">{club.name}</span>
              <span className="club-description">{club.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="signup-section" id="signup" aria-labelledby="signup-heading">
        <div className="signup-inner">
          <div className="signup-copy">
            <p className="eyebrow">ONE SMALL STEP</p>
            <h2 id="signup-heading">Save your<br />spot.</h2>
            <p>Choose a club and we’ll add you to the shared roster. Easy as that.</p>
            <div className="privacy-note">
              <span aria-hidden="true">ⓘ</span>
              <p>
                The roster is public. Anyone with this page can see student
                names, IDs, and club memberships.
              </p>
            </div>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="full-name">Your name</label>
            <input
              autoComplete="name"
              id="full-name"
              maxLength={100}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Jordan Lee"
              required
              value={name}
            />

            <label htmlFor="student-id">Student ID</label>
            <input
              id="student-id"
              maxLength={50}
              onChange={(event) => setStudentId(event.target.value)}
              placeholder="Enter your student ID"
              required
              value={studentId}
            />

            <label htmlFor="club-name">Choose your club</label>
            <select
              id="club-name"
              onChange={(event) => setClubName(event.target.value)}
              required
              value={clubName}
            >
              <option disabled value="">Select a club</option>
              {CLUBS.map((club) => (
                <option key={club.name} value={club.name}>{club.name}</option>
              ))}
            </select>

            {formError && <p className="form-message error-message" role="alert">{formError}</p>}
            {successMessage && <p className="form-message success-message" role="status">{successMessage}</p>}
            <button className="button button-bright submit-button" disabled={submitting} type="submit">
              {submitting ? "Saving your spot..." : "Join this club"}
              {!submitting && <span aria-hidden="true">↗</span>}
            </button>
            <p className="form-footnote">No account needed. Just bring yourself.</p>
          </form>
        </div>
      </section>

      <section className="roster-section section-wrap" id="roster" aria-labelledby="roster-heading">
        <div className="section-heading roster-heading">
          <div>
            <p className="eyebrow">THE COMMUNITY BOARD</p>
            <h2 id="roster-heading">Who’s in?</h2>
          </div>
          <div className="roster-total">
            <strong>{registrations.length}</strong>
            <span>{registrations.length === 1 ? "sign-up" : "sign-ups"} so far</span>
          </div>
        </div>

        <div className="roster-tools">
          <label className="search-field">
            <span className="visually-hidden">Search by name or student ID</span>
            <span aria-hidden="true">⌕</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search names or IDs"
              type="search"
              value={search}
            />
          </label>
          <label className="filter-field">
            <span className="visually-hidden">Filter by club</span>
            <select onChange={(event) => setFilterClub(event.target.value)} value={filterClub}>
              <option>All clubs</option>
              {CLUBS.map((club) => <option key={club.name}>{club.name}</option>)}
            </select>
          </label>
          <button
            className="refresh-button"
            disabled={loadingRoster}
            onClick={() => void loadRoster()}
            type="button"
          >
            <span aria-hidden="true">↻</span> Refresh
          </button>
        </div>

        <div className="table-frame">
          <table>
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Student ID</th>
                <th scope="col">Club</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loadingRoster ? (
                <tr><td className="table-message" colSpan={4}>Loading the community board...</td></tr>
              ) : rosterError ? (
                <tr><td className="table-message table-error" colSpan={4}>{rosterError}</td></tr>
              ) : visibleRegistrations.length === 0 ? (
                <tr>
                  <td className="table-message" colSpan={4}>
                    {registrations.length === 0
                      ? "No sign-ups yet. Be the first to find your people!"
                      : "No sign-ups match this search."}
                  </td>
                </tr>
              ) : (
                visibleRegistrations.map((registration, index) => (
                  <tr key={registration.id}>
                    <td>
                      <span className="student-cell">
                        <span className={`student-avatar avatar-${index % 4}`} aria-hidden="true">
                          {registration.full_name.charAt(0).toUpperCase()}
                        </span>
                        {registration.full_name}
                      </span>
                    </td>
                    <td className="student-number">{registration.student_id}</td>
                    <td><span className="club-pill">{registration.club_name}</span></td>
                    <td className="joined-date">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(registration.created_at))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="roster-disclaimer">
          This roster is publicly viewable and includes student IDs. Please only
          share information approved for your school’s use.
        </p>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">c</span>
          clubhouse
        </a>
        <span>Made for finding your people.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
