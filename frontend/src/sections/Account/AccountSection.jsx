import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "./AccountSection.css";

function AccountSection() {
  const navigate = useNavigate();

  const { user, updateProfile, deleteAccount } = useAuth();

  /* -------------------------------- */
  /* Edit profile                    */
  /* -------------------------------- */

  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileError, setProfileError] = useState("");

  const [profileMessage, setProfileMessage] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);

  /* -------------------------------- */
  /* Delete account                  */
  /* -------------------------------- */

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");

  const [deleteError, setDeleteError] = useState("");

  const [deletingAccount, setDeletingAccount] = useState(false);

  /* -------------------------------- */
  /* Sync profile form               */
  /* -------------------------------- */

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);

  /* -------------------------------- */
  /* Profile values                  */
  /* -------------------------------- */

  const firstName = user?.firstName || "—";

  const lastName = user?.lastName || "—";

  const email = user?.email || "—";

  const isPremium = Boolean(user?.isPremium);

  /* -------------------------------- */
  /* Profile input                   */
  /* -------------------------------- */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));

    setProfileError("");
    setProfileMessage("");
  };

  /* -------------------------------- */
  /* Cancel edit                     */
  /* -------------------------------- */

  const handleCancelEdit = () => {
    setEditingProfile(false);

    setProfileError("");
    setProfileMessage("");

    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  /* -------------------------------- */
  /* Save profile                    */
  /* -------------------------------- */

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    setProfileError("");
    setProfileMessage("");

    if (!profileForm.firstName.trim()) {
      setProfileError("Förnamn måste fyllas i.");

      return;
    }

    if (!profileForm.lastName.trim()) {
      setProfileError("Efternamn måste fyllas i.");

      return;
    }

    if (!profileForm.email.trim()) {
      setProfileError("E-post måste fyllas i.");

      return;
    }

    if (profileForm.newPassword && profileForm.newPassword.length < 8) {
      setProfileError("Det nya lösenordet måste innehålla minst 8 tecken.");

      return;
    }

    if (profileForm.newPassword !== profileForm.confirmPassword) {
      setProfileError("Lösenorden matchar inte.");

      return;
    }

    try {
      setSavingProfile(true);

      await updateProfile({
        firstName: profileForm.firstName.trim(),

        lastName: profileForm.lastName.trim(),

        email: profileForm.email.trim(),

        newPassword: profileForm.newPassword,
      });

      setProfileMessage("Profilen har uppdaterats.");

      setEditingProfile(false);

      setProfileForm((current) => ({
        ...current,
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Could not update profile:", error);

      setProfileError(error.message || "Profilen kunde inte uppdateras.");
    } finally {
      setSavingProfile(false);
    }
  };

  /* -------------------------------- */
  /* Delete account                  */
  /* -------------------------------- */

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Ange ditt lösenord.");

      return;
    }

    try {
      setDeletingAccount(true);
      setDeleteError("");

      await deleteAccount(deletePassword);

      navigate("/");
    } catch (error) {
      console.error("Could not delete account:", error);

      setDeleteError(error.message || "Kontot kunde inte tas bort.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <main className="account-page">
      <div className="account-container">
        <button
          type="button"
          className="account-back-button"
          onClick={() => navigate("/min-traning")}
        >
          ← Till Min träning
        </button>

        <header className="account-header">
          <span className="account-eyebrow">Mitt konto</span>

          <h1>Konto och inställningar</h1>

          <p>Hantera dina personuppgifter och din Premiumstatus.</p>
        </header>

        <div className="account-grid">
          {/* -------------------------------- */}
          {/* Profile                          */}
          {/* -------------------------------- */}

          <section className="account-card account-card--profile">
            <div className="account-card__heading">
              <div className="account-card__icon">👤</div>

              <div>
                <h2>Profil</h2>

                <p>Dina personuppgifter</p>
              </div>
            </div>

            {!editingProfile ? (
              <>
                <div className="account-profile-list">
                  <div className="account-profile-row">
                    <span>Förnamn</span>

                    <strong>{firstName}</strong>
                  </div>

                  <div className="account-profile-row">
                    <span>Efternamn</span>

                    <strong>{lastName}</strong>
                  </div>

                  <div className="account-profile-row">
                    <span>E-post</span>

                    <strong>{email}</strong>
                  </div>

                  <div className="account-profile-row">
                    <span>Lösenord</span>

                    <strong className="account-password-hidden">
                      ••••••••
                    </strong>
                  </div>
                </div>

                {profileMessage && (
                  <p className="account-success-message">{profileMessage}</p>
                )}

                <button
                  type="button"
                  className="account-button account-button--secondary"
                  onClick={() => {
                    setEditingProfile(true);
                    setProfileMessage("");
                  }}
                >
                  Redigera profil
                </button>
              </>
            ) : (
              <form
                className="account-profile-form"
                onSubmit={handleSaveProfile}
              >
                <label>
                  <span>Förnamn</span>

                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                  />
                </label>

                <label>
                  <span>Efternamn</span>

                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                  />
                </label>

                <label>
                  <span>E-post</span>

                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                  />
                </label>

                <div className="account-password-section">
                  <strong>Ändra lösenord</strong>

                  <small>Lämna tomt om du inte vill ändra lösenordet.</small>
                </div>

                <label>
                  <span>Nytt lösenord</span>

                  <input
                    type="password"
                    name="newPassword"
                    value={profileForm.newPassword}
                    onChange={handleProfileChange}
                    autoComplete="new-password"
                    placeholder="Minst 8 tecken"
                  />
                </label>

                <label>
                  <span>Bekräfta nytt lösenord</span>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileForm.confirmPassword}
                    onChange={handleProfileChange}
                    autoComplete="new-password"
                  />
                </label>

                {profileError && (
                  <p className="account-error-message">{profileError}</p>
                )}

                <div className="account-form-actions">
                  <button
                    type="submit"
                    className="account-button account-button--primary"
                    disabled={savingProfile}
                  >
                    {savingProfile ? "Sparar..." : "Spara ändringar"}
                  </button>

                  <button
                    type="button"
                    className="account-button account-button--secondary"
                    onClick={handleCancelEdit}
                    disabled={savingProfile}
                  >
                    Avbryt
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* -------------------------------- */}
          {/* Premium                          */}
          {/* -------------------------------- */}

          <section className="account-card account-card--premium">
            <div className="account-card__heading">
              <div className="account-card__icon account-card__icon--premium">
                ✨
              </div>

              <div>
                <h2>Premium</h2>

                <p>Din åtkomst</p>
              </div>
            </div>

            {isPremium ? (
              <div className="account-premium-status">
                <div className="account-premium-status__top">
                  <div>
                    <span className="account-premium-badge">Premiumkonto</span>

                    <h3>Premium är aktivt</h3>
                  </div>

                  <span className="account-premium-check">✓</span>
                </div>

                <p>
                  Du har obegränsad tillgång till hela frågebanken, Smart
                  träning och provsimulatorn.
                </p>

                <div className="account-premium-details">
                  <div>
                    <span>Status</span>

                    <strong>Aktiv</strong>
                  </div>

                  <div>
                    <span>Åtkomst</span>

                    <strong>Full tillgång</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="account-free-status">
                <span className="account-free-badge">Gratis konto</span>

                <h3>Du använder gratisversionen</h3>

                <p>
                  Uppgradera när du vill få tillgång till alla
                  Premiumfunktioner.
                </p>

                <button
                  type="button"
                  className="account-button account-button--primary"
                  onClick={() => navigate("/premium")}
                >
                  Lås upp Premium →
                </button>
              </div>
            )}
          </section>
        </div>

        {/* -------------------------------- */}
        {/* Delete                           */}
        {/* -------------------------------- */}

        <section className="account-danger">
          {!showDeleteConfirmation ? (
            <>
              <div>
                <strong>Ta bort konto</strong>

                <p>Radera ditt konto och dina sparade uppgifter permanent.</p>
              </div>

              <button
                type="button"
                className="account-delete-button"
                onClick={() => {
                  setShowDeleteConfirmation(true);

                  setDeleteError("");
                }}
              >
                Ta bort konto
              </button>
            </>
          ) : (
            <div className="account-delete-confirmation">
              <div>
                <strong>Är du säker?</strong>

                <p>
                  Detta går inte att ångra. Ange ditt lösenord för att bekräfta.
                </p>
              </div>

              <input
                type="password"
                value={deletePassword}
                onChange={(event) => {
                  setDeletePassword(event.target.value);

                  setDeleteError("");
                }}
                placeholder="Ditt lösenord"
                autoComplete="current-password"
              />

              {deleteError && (
                <p className="account-error-message">{deleteError}</p>
              )}

              <div className="account-form-actions">
                <button
                  type="button"
                  className="account-delete-button"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                >
                  {deletingAccount ? "Tar bort..." : "Ja, ta bort mitt konto"}
                </button>

                <button
                  type="button"
                  className="account-button account-button--secondary"
                  onClick={() => {
                    setShowDeleteConfirmation(false);

                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  disabled={deletingAccount}
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AccountSection;
