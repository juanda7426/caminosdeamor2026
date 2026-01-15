import { useCompany } from "../context/CompanyContext";
import {
  Number,
  instagramLink,
  facebookLink,
  tiktokLink,
  websiteLink,
} from "../config/arreglos";

export const FooterLove = () => {
  const { companyInfo } = useCompany();

  // Use values from context, or fall back to defaults from arreglos.js if missing/empty
  // Note: We use || because backend might return empty strings "" which are falsy
  const phone = companyInfo?.phone || Number;
  const phone2 = companyInfo?.phone2 || "310 539 06 93";
  const email = companyInfo?.email || "caminosdeamorsas@gmail.com";
  const address = companyInfo?.address || "";
  const facebook = companyInfo?.facebook || facebookLink;
  const instagram = companyInfo?.instagram || instagramLink;
  const tiktok = companyInfo?.tiktok || tiktokLink;
  const website = companyInfo?.website || websiteLink;

  return (
    <>
      <div
        className="container-fluid text-white"
        style={{
          backgroundColor: "#0087B7",
          flexShrink: 0,
          width: "100%",
          marginTop: "auto",
        }}
      >
        <div className="row text-center">
          {/* Col1 */}
          <div className="col-sm-4 mt-2">
            <div className="text-center my-0">
              <img
                src="../img/logo.png "
                className="img-fluid my-0"
                width="130"
                alt="logo caminos de amor"
              />
              <h5>Caminos de Amor</h5>
            </div>
          </div>

          {/* Col2 */}
          <div className="col-sm-4 mt-2">
            <h5 className="mt-3 mb-4">Siguenos</h5>
            <div className="mt-2">
              {facebook && (
                <a
                  className="m-3"
                  title="Facebook"
                  href={facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    className="fab fa-facebook fs-3"
                    style={{ color: "white" }}
                  />
                </a>
              )}
              {instagram && (
                <a
                  className="m-3"
                  title="Instagram"
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    className="fab fa-instagram fs-3"
                    style={{ color: "white" }}
                  />
                </a>
              )}
              {tiktok && (
                <a
                  className="m-3"
                  title="Tik-Tok"
                  href={tiktok}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i
                    className="fab fa-tiktok fs-3"
                    style={{ color: "white" }}
                  />
                </a>
              )}
            </div>
          </div>

          {/* col3 */}
          <div className="col-sm-4 mt-1">
            {website && (
              <p className="mb-0 mt-2">
                <i className="fa fa-globe me-3 mt-3" />
                {website}
              </p>
            )}
            <p className="my-0">
              <i className="fa fa-phone-alt me-3" />
              {phone} {phone2 ? `/ ${phone2}` : ""}
            </p>
            {email && (
              <p className="my-0">
                <i className="fa fa-envelope me-3" />
                {email}
              </p>
            )}
            {address && (
              <p className="my-0">
                <i className="fa fa-map-marker-alt me-3" />
                {address}
              </p>
            )}
          </div>
        </div>

        <div
          className="row justify-content-center bg-dark"
          style={{ fontSize: "12px" }}
        >
          <div className="col-md-4 text-center">
            <p className="my-2">Copyright 2024 &copy; Caminos de Amor S.A.S</p>
          </div>
          <div className="col-md-4 text-center text-md-center mb-md-0">
            <p className="my-2 text-sm text-gray-500">
              Desarrollado por{" "}
              <a
                href="https://juanda7426.github.io/Juanda-Code/"
                className="hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Juanda Code
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
