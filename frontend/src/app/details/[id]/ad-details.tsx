"use client";

import AdList, { AdListProps } from "@/components/ad-list/ad-list";
import Avatar from "@/components/avatar/Avatar";
import Claim, { ClaimProps } from "@/components/claim/Claim";
import Header from "@/components/header/header";
import VoteIndicator from "@/components/vote-indicator/VoteIndicator";
import { AdDetails, Coordinates } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button, Card, Carousel, CarouselItem } from "react-bootstrap";
import { ChevronLeft, ChevronRight, Heart, HeartFill } from "react-bootstrap-icons";
import styles from "./style.module.css";
import { OpenInMapsButton } from "@/components/address-picker/address-picker";
import { rnEvents } from "@/lib/rn-events";

export interface AdDetailsProps {
  ad: AdDetails;
  similarItemsAdListProps: AdListProps;
  isFavorited: boolean;
  ClaimWareProps: Omit<ClaimProps, "variant">;
  traderHref: string | undefined;
  chatHref: string | undefined;
  traderRatingUp: number;
  traderRatingDown: number;
  isChatWithTraderVisible: boolean;
  isReportAdVisible: boolean;
  isTraderVisible: boolean;
  onFavoriteClick: () => void;
}

const AdDetails: React.FC<AdDetailsProps> = (props) => {
  return (
    <div className="container pt-5 pb-3">
      <Header
        rightButtons={
          <>
            {props.isFavorited ? (
              <HeartFill className={styles.icon} onClick={props.onFavoriteClick} color="#F04438" />
            ) : (
              <Heart className={styles.icon} onClick={props.onFavoriteClick} />
            )}

            {/* <Cart className={styles.icon} /> */}
          </>
        }
      />

      {(props.ad?.photos?.length ?? 0) > 0 ? (
        <Carousel
          className={`${styles["carousel-container"]} mb-2`}
          prevIcon={<ChevronLeft color="black" size={25} />}
          nextIcon={<ChevronRight color="black" size={25} />}
        >
          {(props.ad?.photos || []).map((image) => (
            <CarouselItem key={`${image.avatar}-${image.id}`} className={`${styles["carousel-inner"]}`}>
              <Image
                alt={image.name}
                src={image.avatar}
                className={styles["image"]}
                width={image.avatar_width}
                height={image.avatar_height}
              />
            </CarouselItem>
          ))}
        </Carousel>
      ) : null}

      <div className="mb-3">
        <div className="fw-bold fs-2">{props.ad?.price} CFA</div>
        <h2 className="fs-4 fw-normal">{props.ad?.title}</h2>
        <div className="fs-6 fw-normal">Category: {props.ad?.categories?.map((item) => item.name)?.join?.(", ")}</div>
        <div className="fs-6 fw-normal">Location: {props.ad?.address}</div>

        {props.ad?.mapUrl ? <Link href={props?.ad.mapUrl}>Afficher sur la carte</Link> : null}
      </div>

      {props?.ad?.lat && props?.ad?.lon ? (
        <div className="mb-3">
          <OpenInMapsButton
            onClick={() => {
              rnEvents.openInMap({
                location: {
                  lat: props?.ad?.lat!,
                  lon: props?.ad?.lon!,
                },
              });
            }}
          />
        </div>
      ) : null}

      <div className="mb-3">
        {props.isChatWithTraderVisible && props.chatHref ? (
          <Link href={props.chatHref}>
            <Button variant="primary" className="w-100">
              Discuter avec le commerçant
            </Button>
          </Link>
        ) : null}
      </div>

      {(props.ad?.characteristics?.length ?? 0) > 0 ? (
        <div className="mb-2">
          <div className="fs-4 fw-semibold">Caractéristiques</div>
          <ul className="list-unstyled">
            {(props.ad?.characteristics || []).map((characteristic, index) => (
              <li key={index}>
                <span className={styles.characteristicItemType}>{characteristic.type}: </span>

                <span className={styles.characteristicItemLabel}>{characteristic.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Card className="w-100 mb-3">
        <Card.Body>
          <Card.Title>Description</Card.Title>
          <Card.Text>{props.ad?.description}</Card.Text>
        </Card.Body>
      </Card>

      {(props.similarItemsAdListProps?.items?.length ?? 0) > 0 ? (
        <div className="mb-2">
          <div className="fs-4 fw-semibold">Articles similaires</div>

          <AdList {...props.similarItemsAdListProps} />
        </div>
      ) : null}

      {props.isTraderVisible ? (
        <Card className="w-100 mb-3">
          <Card.Body>
            <Card.Title>Commerçant</Card.Title>

            <div className="d-flex flex-row align-items-center gap-2">
              <Avatar name={props.ad?.seller?.name} round size="50px" src={props?.ad?.seller?.avatar} />
              {props.traderHref ? <Link href={props.traderHref}>{props.ad?.seller?.name || "Sans nom"}</Link> : null}
            </div>
            {/* <StarRatings rating={props.traderRatingUp} numberOfStars={5} starDimension="20px" starSpacing="5px" /> */}
            <div className="mt-2">
              <VoteIndicator downVotes={props.traderRatingDown} upVotes={props.traderRatingUp} />
            </div>
          </Card.Body>
        </Card>
      ) : null}

      {props.isReportAdVisible ? (
        <div className="d-flex gap-2 justify-content-end w-100 mb-3">
          <Claim {...props.ClaimWareProps} variant="ware" />
        </div>
      ) : null}
    </div>
  );
};

export default AdDetails;
