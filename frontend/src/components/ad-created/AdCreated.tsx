import Link from "next/link";
import { Button } from "react-bootstrap";

export interface AdCreatedProps {
  backToListHref: string;
  onPublishPress: () => void;
}

export function AdCreated(props: AdCreatedProps) {
  return (
    <div className="d-flex h-100 w-100 flex-column align-items-center justify-content-center">
      <p className="fw-semibold fs-4">Annonce créée!</p>
      <p className="fw-regular fs-6 text-center">
        L&lsquo;annonce est enregistrée en tant que brouillon. Vous pouvez la rendre publique maintenant.
      </p>

      <Button variant="primary" onClick={props.onPublishPress} className="mb-2">
        Publier l&lsquo;annonce
      </Button>
      <Link href={props.backToListHref}>
        <Button variant="outline-primary">Retour à la liste</Button>
      </Link>
    </div>
  );
}
