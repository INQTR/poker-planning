use actix_web::{HttpRequest, HttpResponse, Result, web};
use async_graphql::{
    Schema,
    http::{GraphQLPlaygroundConfig, playground_source},
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse, GraphQLSubscription};

use crate::schema::PokerPlanningSchema;

pub async fn health_check() -> HttpResponse {
    HttpResponse::Ok().finish()
}

pub async fn index(
    schema: web::Data<PokerPlanningSchema>,
    request: GraphQLRequest,
) -> GraphQLResponse {
    schema.execute(request.into_inner()).await.into()
}

pub async fn index_playground() -> Result<HttpResponse> {
    let source = playground_source(GraphQLPlaygroundConfig::new("/").subscription_endpoint("/"));
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(source))
}

pub async fn index_ws(
    schema: web::Data<PokerPlanningSchema>,
    request: HttpRequest,
    payload: web::Payload,
) -> Result<HttpResponse> {
    GraphQLSubscription::new(Schema::clone(&*schema)).start(&request, payload)
}
