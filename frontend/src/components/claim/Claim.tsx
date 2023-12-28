"use client";

import { postWareClaimReq } from "@/types/api";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";

export interface ClaimForm extends Pick<postWareClaimReq, "message"> {
  reason: string;
}

export interface ClaimProps {
  variant: "ware" | "trader";
  isOpen?: boolean;
  isReportButtonDisplayed?: boolean;
  title?: string;
  onClaimSubmit: (values: ClaimForm) => Promise<void>;
  onReportAdClick?: () => void;
  onHide?: () => void;
}

function Claim(props: ClaimProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ClaimForm>();

  useEffect(() => {
    if (props.isOpen !== undefined) {
      setIsOpen(props.isOpen);
    }
  }, [props.isOpen]);

  useEffect(() => {
    if (form.formState.isSubmitted) {
      setIsOpen(false);
      form.reset();
    }
    // eslint-disable-next-line
  }, [form.formState.isSubmitted]);

  return (
    <>
      <Modal
        show={isOpen}
        onHide={() => {
          setIsOpen(false);
          props?.onHide?.();
        }}
      >
        <form onSubmit={form.handleSubmit(props.onClaimSubmit)}>
          <Modal.Header closeButton>{props.title || "Signaler l'annonce"}</Modal.Header>
          <Modal.Body>
            <Form.Check
              disabled={form.formState.isSubmitting}
              type="radio"
              {...form.register("reason")}
              value="scam"
              label="Arnaque"
            />
            <Form.Check
              disabled={form.formState.isSubmitting}
              type="radio"
              {...form.register("reason")}
              value="abuse"
              label="Abus"
            />
            <Form.Check
              disabled={form.formState.isSubmitting}
              type="radio"
              {...form.register("reason")}
              value="other"
              label="Autre"
            />
            {form.watch("reason") === "other" ? (
              <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Veuillez nous dire ce qui ne va pas avec l&lsquo;annonce (facultatif)</Form.Label>
                <Form.Control
                  disabled={form.formState.isSubmitting}
                  as="textarea"
                  rows={3}
                  {...form.register("message")}
                />
              </Form.Group>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Soumettre
              {form.formState.isSubmitting ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
              ) : null}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {props.isReportButtonDisplayed === undefined || props.isReportButtonDisplayed ? (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            props.onReportAdClick?.();
            setIsOpen(true);
          }}
        >
          {(props.variant === "ware" && "Signaler l&lsquo;annonce") ||
            (props.variant === "trader" && "Signaler le commerçant")}
        </Button>
      ) : null}
    </>
  );
}

export default Claim;
